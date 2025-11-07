# Secure Code Review - Adib Aulia Rahman
Project: vulnerable.js
Tanggal: 2025-11-07

## Summary (1–2 kalimat)
Ringkasan temuan dan prioritas (mis. "Ditemukan 4 issue, 3 high, 1 medium").

## Findings (minimum 5)
1. **Issue:** SQL Injection  
   **Location:** /search handler (baris 80)
   **Risk:** High — attacker bisa manggunakan parameter untuk mengeksekusi query baru.  
   **Recommendation:** Gunakan prepared statement.;

2. **Issue:** Stored XSS  
   **Location:** /comments render (baris 137)  
   **Risk:** High — payload tersimpan dan dieksekusi pada pengunjung.  
   **Recommendation:** Encode on output atau gunakan sanitizer (DOMPurify) sebelum render.

3. **Issue:** IDOR / Broken Access Control  
   **Location:** /product/:id (baris 104)  
   **Risk:** High — resource diakses tanpa authorization check.  
   **Recommendation:** Periksa ownership/permissions sebelum return resource.

4. **Issue:** Reflected XSS  
   **Location:** /reflect (baris 167)  
   **Risk:** Medium — input langsung direfleksikan ke page.  
   **Recommendation:** Escape output dan validasi input.

## Verification / How I tested
- Contoh request/URL yang saya pakai untuk reproduce (screen capture disertakan jika ada).

## Patch idea / Code snippet (singkat)
- Contoh prepared statement, contoh penggunaan `escapeHtml()` atau `textContent` replacement.

## Notes
- Prioritas: (High / Medium / Low)
- Keterangan tambahan / risiko bisnis
