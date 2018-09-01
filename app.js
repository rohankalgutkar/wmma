var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Auth
var session = require('express-session');
var session = require('express-session');
var passport   = require('passport');
var {mongoose} = require('./db/mongoose');
var MongoStore = require('connect-mongo')(session);
// var connection = mongoose.createConnection(connectionOptions);

var app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/partials/');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth setup
app.use(session({
  secret: 'salt&pepper',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
