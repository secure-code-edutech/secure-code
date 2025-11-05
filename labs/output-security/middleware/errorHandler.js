module.exports = (err, req, res, next) => {
  if (!req.originalUrl.startsWith("/.well-known")) {
    console.error(`ERROR >>> ${err.stack || err}`);
  }

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;

  const message =
    status === 404
      ? "Halaman tidak ditemukan."
      : "Terjadi kesalahan pada server.";

  const subMessage =
    status === 404
      ? "Silakan kembali ke halaman utama."
      : "Silahkan coba kembali secara berkala.";


  res.status(status).send(`
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><title>Error ${status}</title></head>
    <body>
      <h1>${message}</h1>
      <p>${subMessage}.</p>
    </body>
    </html>
  `);
};
