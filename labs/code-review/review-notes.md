# Secure Code Review - <Nama Peserta>
Project: vulnerable.js
Tanggal: 2025-11-07

## Findings (minimum 3)
1. **Issue:** SQL Injection  
   **Location:** endpoint /search
   const sql = `SELECT id, title, content FROM posts WHERE title LIKE '%${q}%' OR content LIKE '%${q}%'`; (baris 80)

   **Masalah:** Input pengguna (q) langsung disisipkan ke dalam query SQL tanpa validasi atau parameter binding. Penyerang dapat memasukkan payload seperti: "?q=' OR '1'='1"

   **Risk:** High — attacker bisa manipulasi query dan mengeksekusi query arbitrary.  
   **Recommendation:** Gunakan prepared statement / parameterized query: Contoh: 
   'db.all("SELECT id,title,content FROM posts WHERE title LIKE ? OR content LIKE ?", [`%${q}%`, `%${q}%`], ...)';
.

2. **Issue:** Stored XSS  
   **Location:** endpoint /comments 
   out += `<li>Post ${r.post_id} - <b>${escapeHtml(r.author)}:</b> ${r.body}</li>`;
   (baris 137) 

   **Masalah:** r.body tidak di-escape, sehingga jika pengguna menyimpan <script> atau payload XSS, script tersebut dijalankan setiap kali halaman komentar dibuka.
   Ini dapat mencuri cookie session, melakukan CSRF, atau defacing UI.

   **Risk:** High — payload tersimpan dan dieksekusi pada pengunjung.  
   **Recommendation:** Escape output sebelum render: ${escapeHtml(r.body)} atau Sanitasi input ketika menyimpan

3. **Issue:** IDOR / Broken Access Control  
   **Location:** Endpoint /posts/:id
   db.get(`SELECT id, owner_id, title, content FROM posts WHERE id = ${id}`, ...
   (baris 104)

   **Masalah:** Tidak ada verifikasi apakah pengguna yang mengakses memiliki izin terhadap owner_id dari post tersebut.
   Semua pengguna bisa mengakses postingan milik orang lain → kebocoran data pribadi/privat.  

   **Risk:** High — resource diakses tanpa authorization check.  
   **Recommendation:** Terapkan sistem login & session atau Cek apakah req.user.id === row.owner_id atau role = admin sebelum menampilkan konten.

   
4. **Issue:** Reflected XSS  
   **Location:** Endpoint Get /reflect
   app.get('/reflect', (req, res) => {
  const msg = req.query.msg || '';
  res.send(`
    ...
    <p>Server echoed (vulnerable): ${msg}</p> <!-- vulnerable: msg not escaped here -->
    ...
  `);
}); (baris 160)  

   **Masalah:** nilai msg dari query string disisipkan langsung ke HTML tanpa escaping/encoding. Jika attacker memasukkan HTML/JS di msg, browser akan merendernya — sehingga terjadi reflected XSS.

   **Risk:** Medium — input langsung direfleksikan ke page.  
   **Recommendation:** 
   1. Escape output : <p>Server echoed (safe): ${escapeHtml(msg)}</p>
   2. Validasi input
   3. Tambahkan Content Security Policy (CSP) : app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'");
  next();
});

   4. Hindari innerHTML / raw HTML di client-side : out.textContent = decoded;
















## Verification / How I tested
- Contoh request/URL yang saya pakai untuk reproduce (screen capture disertakan jika ada).

## Patch idea / Code snippet (singkat)
- Contoh prepared statement, contoh penggunaan `escapeHtml()` atau `textContent` replacement.

## Notes
- Prioritas: (High / Medium / Low)
- Keterangan tambahan / risiko bisnis
