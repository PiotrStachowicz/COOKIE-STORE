let express = require('express');
let path = require('path');
let cookie_parser = require('cookie-parser');

let index_router = require('./routes/home_page');
const createError = require("http-errors");

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index_router);


// Error handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.render('error', {message: err.message, id: err.status || 500});
});



module.exports = app;