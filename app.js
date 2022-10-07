var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/conection')
const session = require('express-session')
const fileUpload = require('express-fileupload')
const hbs = require('express-handlebars')
const dotenv = require('dotenv').config

const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const DashbordRouter = require('./routes/Dashbord');
const {
  default: mongoose
} = require('mongoose');
const helpers = require('handlebars-helpers');

var app = express();
var time = 1000 * 60 * 60 * 60 * 24 * 30 *
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'key',
    cookie: {
      maxAge: time
    }

  }))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.connect((err) => {
  if (err) {
    console.log('databse connection failed');
    console.log(err);
  } else {
    console.log('database connected');
  }
})
app.use(fileUpload())

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/home', homeRouter);
app.use('/Dashbord', DashbordRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.render('404')
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('500');
});

module.exports = app;