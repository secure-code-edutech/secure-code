module.exports = (err, req, res, next) => {
  // Log error detail di server (tidak boleh ke klien)
  console.error(err && err.stack ? err.stack : err);

  //const sanitizeHtml = require('sanitize-html');
  //const clean = sanitizeHtml(dirtyHtml, { allowedTags: [], allowedAttributes: {} });

  // Untuk API respon, kirim JSON aman
  if (req.xhr || (req.headers && req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(err.status || 500).json({ error: 'Internal Server Error' });
  }

  // Untuk halaman web, kirim pesan umum (tidak menyertakan stack atau data mentah)
  res.status(err.status || 500).send('Internal Server Error');
};
