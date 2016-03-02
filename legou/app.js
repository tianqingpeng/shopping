var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var multer = require('multer');
var session = require('express-session');

var routes = require('./routes/index');
//var register = require('./routes/register');
var users = require('./routes/users');

var app = express();
//require('./routes')(app);
/*app.get('/', function(req, res){
	res.render('register');
})
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/register', register);
app.use('/users', users);

mongoose.connect("mongodb://127.0.0.1:27017/user");
app.use(session({
	resave:false, 
    saveUninitialized: true,
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));
app.use(function(req, res, next){
    res.locals.user = req.session.user; //保存用户信息
    var err = req.session.error;  //保存结果响应信息
    res.locals.message = '';  // 保存html标签
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
