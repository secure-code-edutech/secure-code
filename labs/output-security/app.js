const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// simple route: profile (renders user-provided name)
app.get('/profile', (req, res) => {
  const name = req.query.name || 'Guest';
  res.render('profile', { user: { name } });
});

// route to trigger error for testing
app.get('/error', (req, res, next) => {
  // simulate an unexpected error
  next(new Error('Simulated test error'));
});

app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// register error handler (vulnerable variant provided)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
