# Secure Code Review - <Nama Peserta>
Project: vulnerable.js
Tanggal: 2025-11-07

## Summary (1–2 kalimat)
Ringkasan temuan dan prioritas (mis. "Ditemukan 5 issue, 2 high, 2 medium, 1 low").
<!-- Ditemukan 3 iss -->

## Findings (minimum 5)
1. **Issue:** SQL Injection  
   **Location:** API GET /search (line 77)  
   **Risk:** High — Attacker bisa manipulasi query dan mengeksekusi query arbitrary.  
   **Recommendation:** Gunakan bind parameter atau replacements paramter. Contoh: `db.get("SELECT ... WHERE name LIKE ?", ['%'+q+'%'])`.

2. **Issue:** IDOR / Broken Access Control  
   **Location:** API GET /posts/:id (line 101)
   **Risk:** High — resource diakses tanpa authorization check.  
   **Recommendation:** Periksa ownership/permissions sebelum return resource. Autentikasi bisa dicek menggunakan token.

3. **Issue:** Stored XSS  
   **Location:** API POST /comments (line 148)  
   **Risk:** High — payload tersimpan dan dieksekusi pada pengunjung.  
   **Recommendation:** Lakukan sanitasi pada kiriman dari user, dan pastikan aman ketika disimpan di database.

4. **Issue:** Reflected XSS  
   **Location:** API GET /reflect (line 164)  
   **Risk:** Medium — inputan user langsung ditampilkan ke page.  
   **Recommendation:** Escape output dan validasi input.

5. **Issue:** DOM-based XSS (client)
   **Location:** API GET /dom (line 177)  
   **Risk:** Medium — penggunaan innerHTML dengan data dari location.hash.  
   **Recommendation:** Gunakan textContent / safe DOM APIs.

## Verification / How I tested
- Tes URL dengan Postman.
- Membaca kodingan.

## Patch idea / Code snippet (singkat)
- Nomor 1, bisa dengan `db.get("SELECT ... WHERE name LIKE ?", ['%'+q+'%'])`
- Nomor 2. `const user = jwt.authenticate(req.headers['x-api-key'])` (contoh kasar).
- Nomor 4. Contoh prepared statement, contoh penggunaan `escapeHtml()` atau `textContent` replacement.

## Notes
- Prioritas: (High -> Medium -> Low)
- Vulner harus clean semua, nanti dimarahin karena security harga mati.
