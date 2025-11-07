# Secure Code Review - <Nama Rivi Lesmana Sulaeman>
Project: vulnerable.js
Tanggal: 2025-11-07

**No. 1**
## Summary (1–2 kalimat)
Insecure secret

**issue**
vulnerable.js terdapat query `INSERT INTO users (username, email, role, password) VALUES
    ('alice', 'alice@example.local', 'user', 'alicepass'),
    ('bob',   'bob@example.local',   'user', 'bobpass'),
    ('admin', 'admin@example.local', 'admin', 'adminpass')`

Passwords untuk semua pengguna ('alicepass', 'bobpass', 'adminpass') disimpan dalam format plaintext (teks biasa) di kolom password.

Jika attacker berhasil mendapatkan akses ke database (melalui SQL Injection, backup yang bocor, atau cara lain), mereka akan segera memiliki semua password pengguna. Mereka kemudian dapat menggunakan kredensial ini untuk menyerang layanan lain yang menggunakan password yang sama (credential stuffing).

**Recomendation** 
Wajib menggunakan hashing yang kuat dan lambat untuk menyimpan kata sandi.

Jangan pernah menyimpan password sebagai teks biasa.

Gunakan algoritma hashing modern seperti bcrypt, Argon2, atau scrypt (bukan MD5 atau SHA-1). Algoritma ini dirancang untuk lambat, yang membuat upaya brute-force menjadi tidak praktis.

Contohnya, Anda harusnya menyimpan hasil hash dari alicepass dan bukan string alicepass itu sendiri.

**No. 2**
## Summary (1–2 kalimat)
Stored Cross-Site Scripting (XSS)

**issue**
`INSERT INTO comments (post_id, author, body) VALUES
    (1, 'alice','Nice post!'),
    (2, 'attacker', '<script>console.log("stored-xss")</script>')`

Jika aplikasi Anda mengambil komentar ini dari database dan menampilkannya langsung di halaman web tanpa sanitasi atau encoding yang tepat (seperti: document.getElementById('comment').innerHTML = data.body), maka script tersebut akan dijalankan di browser pengguna lain.

Ini dikenal sebagai Stored XSS, yang memungkinkan attacker mencuri session cookie, mengarahkan pengguna ke situs berbahaya, atau memodifikasi tampilan halaman.

**Recomendation**
Selalu ubah karakter khusus HTML (seperti < menjadi &lt; dan > menjadi &gt;) saat menampilkan konten yang dimasukkan pengguna. Ini memastikan bahwa browser memperlakukan kode berbahaya sebagai teks biasa, bukan kode yang dapat dieksekusi.

**No. 3**
## Summary (1–2 kalimat)
'/posts/:id'
kerentanan IDOR (Insecure Direct Object Reference).

**issue**
`INSERT INTO posts (owner_id, title, content) VALUES
    (1, 'Hello World', 'This is a safe post.'),
    (2, 'Insecure Post', 'Try to find vulnerabilities!')`

Tabel posts (owner_id): menggunakan ID numerik sederhana (1 dan 2) untuk owner_id. Jika pengguna mencoba mengakses postingan dengan URL seperti /post?id=2 dan aplikasi hanya memverifikasi bahwa pengguna telah login tanpa memeriksa apakah user_id yang sedang login cocok dengan owner_id makan ini adalah kerentanan IDOR.

**Recomendation**
Cek kepemilikan (if (post.owner_id === current_user.id)).

Gunakan ID Buram (UUIDs): Untuk endpoint publik, pertimbangkan untuk menggunakan identifier yang panjang dan tidak dapat ditebak (seperti UUID) daripada ID numerik yang berurutan.

**No. 4**
## Summary (1–2 kalimat)
SQL Injection (SQLi)

**issue**
// Vulnerable SQL concatenation:
const sql = `SELECT id, title, content FROM posts WHERE title LIKE '%${q}%' OR content LIKE '%${q}%'`;

const q = req.query.q || ''; Baris ini tidak disanitasi, penyerang dapat memasukkan karakter khusus SQL untuk mengubah struktur kueri yang dimaksudkan.

Contoh serangan : ' OR '1'='1

**Recomendation**
Gunakan harus memanfaatkan placeholder (?) yang disediakan oleh driver SQLite atau Prepared Statements lainnya.

Ringkasan temuan dan prioritas (mis. "Ditemukan 5 issue, 2 high, 2 medium, 1 low").

**No. 5**
## Summary (1–2 kalimat)
Reflected XSS

**issue**
pada get '/reflect'
Rentan (Vulnerable): Input tidak dibersihkan saat ditampilkan sebagai output di paragraf, seperti yang ditunjukkan oleh komentar dalam kode:
<p>Server echoed (vulnerable): ${msg}</p>

**Recomendation**
Untuk memperbaiki kerentanan ini, Anda harus memastikan bahwa setiap kali data dari input pengguna (msg) dimasukkan ke dalam output HTML, data tersebut harus melalui fungsi escapeHtml().

## Findings (minimum 5)
1. **Issue:** SQL Injection
   **Location:** /search handler (baris XX)  
   **Risk:** High — attacker bisa manipulasi query dan mengeksekusi query arbitrary.  
   **Recommendation:** Gunakan parameterized query / prepared statements. Contoh: `db.get("SELECT ... WHERE name LIKE ?", ['%'+q+'%'])`.

2. **Issue:** Stored XSS  
   **Location:** /comments render (baris XX)  
   **Risk:** High — payload tersimpan dan dieksekusi pada pengunjung.  
   **Recommendation:** Encode on output atau gunakan sanitizer (DOMPurify) sebelum render.

3. **Issue:** IDOR / Broken Access Control  
   **Location:** /product/:id (baris XX)  
   **Risk:** High — resource diakses tanpa authorization check.  
   **Recommendation:** Periksa ownership/permissions sebelum return resource.

4. **Issue:** Reflected XSS  
   **Location:** /reflect (baris XX)  
   **Risk:** Medium — input langsung direfleksikan ke page.  
   **Recommendation:** Escape output dan validasi input.

5. **Issue:** DOM-based XSS (client)  
   **Location:** /dom (script block)  
   **Risk:** Medium — penggunaan innerHTML dengan data dari location.hash.  
   **Recommendation:** Gunakan textContent / safe DOM APIs.

## Verification / How I tested
- Contoh request/URL yang saya pakai untuk reproduce (screen capture disertakan jika ada).

## Patch idea / Code snippet (singkat)
- Contoh prepared statement, contoh penggunaan `escapeHtml()` atau `textContent` replacement.

## Notes
- Prioritas: (High / Medium / Low)
- Keterangan tambahan / risiko bisnis
