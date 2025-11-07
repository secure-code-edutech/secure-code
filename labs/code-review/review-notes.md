# Secure Code Review - <Hisyam>
Project: vulnerable.js
Tanggal: 2025-11-07

## Findings
1. **Issue:** SQL Injection  
   **Location:** /search, /login 
   **Risk:** Attacker bisa menyisipkan SQL untuk membaca/menulis data yang tidak seharusnya, eskalasi akses, atau menghapus data.  
   **Recommendation:** Gunakan parameterized query / prepared statements. Validasi & normalisasi input (mis. id harus integer Sanitasi logging agar tidak muncul.

2. **Issue:** Stored XSS  
   **Location:** /comments
   **Risk:** attacker menyimpan payload berbahaya di dalam <script>...</script> ke Database, sehingga user yang membuka /comments akan mengeksekusi JS terpasang.
   **Recommendation:** Encode/escape semua output HTML (server-side) saat menampilkan konten yang berasal dari user. Sanitasi Body ketika Post ke Database

3. **Issue:** Broken Access Control dan SQL Injection  
   **Location:** /posts/:id
   **Risk:** Attacker bisa get data punya orang lain dan id ketika bukan number bisa menyisipkan SQL
   **Recommendation:** Tambahkan authorisasi user, dan gunakan parameterized query / prepared statements.

## Fixing
1. **Location** /search
   **before** 
   const q = req.query.q || '';
   const sql = `SELECT id, title, content FROM posts WHERE title LIKE '%${q}%' OR content LIKE '%${q}%'`;
   **after**
   const q = req.query.q || '';
   const like = `%${q}%`;
   const sql = `SELECT id, title, content FROM posts WHERE title LIKE ? OR content LIKE ?`;

2. **Location** /comments
   **before** 
   // Method Get
   rows.forEach(r => { out += <li>Post ${r.post_id} - <b>${escapeHtml(r.author)}:</b> ${r.body}</li>; });

   // Method Post
   db.run(`INSERT INTO comments (post_id, author, body) VALUES (?, ?, ?)`, [post, author, body], function (err) {
    if (err) return res.status(500).send('DB error on insert');
    res.redirect('/comments?post=' + post);
   });
   **after**
   // Method GET
   rows.forEach(r => { out += <li>Post ${escapeHtml(String(r.post_id))} - <b>${escapeHtml(r.author)}:</b> ${escapeHtml(r.body)}</li>; });

   // tambahkan sanitasi saat store raw body pada Method POST
   const sanitizeHtml = require('sanitize-html');
   const body = sanitizeHtml(bodyRaw, {
    allowedTags: ['b','i','em','strong','a'],
    allowedAttributes: { a: ['href', 'rel', 'target'] }
   });

3. **Location** /posts/:id
   **before** 
   db.get(`SELECT id, owner_id, title, content FROM posts WHERE id = ${id}`, [], ...)
   
   **after**
   // bisa tambah middleware untuk get data usernya, ketika tidak sesuai lempar unauthorized
   const currentUser = req.user; 
   if (!currentUser) return res.status(401).send('Unauthorized');

   const id = Number(req.params.id);
   if (!Number.isInteger(id)) return res.status(400).send('Invalid ID');
   db.get(`SELECT id, owner_id, title, content FROM posts WHERE id = ?`, [id], (err, row) => {
   ...
   });

   // cek otorisasi
   if (row.owner_id !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).send('Forbidden');
   }
