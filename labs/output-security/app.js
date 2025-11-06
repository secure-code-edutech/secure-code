const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// simple route: profile (renders user-provided name)
app.get('/profile', (req, res) => {
  //   function escapeHTML(str = '') {
  // return str
  //   .replace(/&/g, '&amp;')
  //   .replace(/</g, '&lt;')
  //   .replace(/>/g, '&gt;')
  //   .replace(/"/g, '&quot;')
  //   .replace(/'/g, '&#39;');
  // }
  // const q = escapeHTML(req.query.name);
  // const name = q || 'Guest';
  const name = req.query.name || 'Guest';
  res.render('profile', { user: { name } });
});


// route to trigger error for testing
app.get('/error', (req, res, next) => {
  // simulate an unexpected error
  next(new Error('Simulated test error'));
});

// register error handler (vulnerable variant provided)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
