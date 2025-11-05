module.exports = (err, req, res, next) => {
  console.log(err);
  // VULNERABLE: sending stack to client
  res.status(404).json({
    ok: false,
    mesage : 'tidak bisa'});
};
