module.exports = (err, req, res, next) => {
  console.log(err);
  // VULNERABLE: sending stack to client
  res.status(500).json({
    ok: false,
    error: 'internal_server_error'
  });
};
