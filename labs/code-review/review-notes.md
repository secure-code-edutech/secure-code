# Secure Code Review - <Nama Peserta>
Project: vulnerable.js
Tanggal: YYYY-MM-DD

## Summary (1–2 kalimat)
Ringkasan temuan dan prioritas (mis. "Ditemukan 5 issue, 2 high, 2 medium, 1 low").

## Findings (minimum 5)
1. **Issue:** SQL Injection  
   **Location:** /search handler (baris 80)  
   **Risk:** High — attacker bisa manipulasi query dan mengeksekusi query arbitrary.  
   **Recommendation:**ganti code sql menjadi const sql = `SELECT id, title, content FROM posts WHERE title LIKE ? OR content LIKE ?`; db.all(sql, [`%${q}%`, `%${q}%`], (err, rows) => {   

2. **Issue:** Stored XSS  
   **Location:** /comments render (baris 123)  
   **Risk:** High — payload tersimpan dan dieksekusi pada pengunjung.  
   **Recommendation:** Encode on output atau gunakan sanitizer (DOMPurify) sebelum render.

3. **Issue:** IDOR / Broken Access Control  
   **Location:** /product/:id (baris 101)  
   **Risk:** High — resource diakses tanpa authorization check.  
   **Recommendation:** Sebelum menampilkan post, perlu memeriksa apakah pengguna yang sedang mengakses post memiliki hak akses yang sesuai

4. **Issue:** Reflected XSS  
   **Location:** /reflect (baris 160)  
   **Risk:** Medium — input langsung direfleksikan ke page.  
   **Recommendation:** Escape output dan validasi input.

5. **Issue:** DOM-based XSS (client)  
   **Location:** /dom (out.innerHTML = decoded;)  
   **Risk:** Medium — penggunaan innerHTML dengan data dari location.hash.  
   **Recommendation:** Gunakan textContent / safe DOM APIs.


## Verification / How I tested
- gunakan postman untuk test sebelum dan sesudah patch.

## Patch idea / Code snippet (singkat)
- nomor 1 ganti code sql menjadi const sql = `SELECT id, title, content FROM posts WHERE title LIKE ? OR content LIKE ?`; db.all(sql, [`%${q}%`, `%${q}%`], (err, rows) => { 

- Nomor 2: ganti code out += `<li>Post ${r.post_id} - <b>${escapeHtml(r.author)}:</b> ${r.body}</li>`; menjadi out += `<li><b>${escapeHtml(r.author)}:</b> ${escapeHtml(r.body)}</li>`;

- nomor 3 bisa diimplementasikan 
if (req.user.id !== row.owner_id) {
  return res.status(403).send('Forbidden');
}

- Nomor 4 gunakan escapeHtml(msg) atau textContent pada client side

-Nomor 5 gunakan textContent jika hanya ingin menampilkan teks, atau sanitasi HTML yang aman (mis. DOMPurify) sebelum memasukkan ke innerHTML

## Notes
- Prioritas: (High / Medium / Low)
- Keterangan tambahan / risiko bisnis
