var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var check_reset_token = require('./routes/check_reset_token');
var login = require('./routes/login');
var register = require('./routes/register');
var reset_password = require('./routes/reset_password');
var send_mail = require('./routes/send_mail');
var check_register_token = require('./routes/check_register_token');
var register_user = require('./routes/register_user');
var user_profile = require('./routes/user_profile');
var wifi_password = require('./routes/wifi_password');
var vulnerability = require('./routes/vulnerability');
var app = express();

// view engine setup
/**app.set - set the value
 * __dirname - the directory of the current module**/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/**express.static -serve static url
 * logger('dev') - for log
 * bodyParser.json - return middleware only parse json
 * urlecncoded - UTF8-encoding
 * cookieparser - parse cookie**/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**import the routes**/
app.use('/', index);
app.use('/users', users);
app.use('/check_reset_token', check_reset_token);
app.use('/login', login);
app.use('/register', register);
app.use('/reset_password', reset_password);
app.use('/send_mail', send_mail);
app.use('/check_register_token', check_register_token);
app.use('/register_user', register_user);
app.use('/user_profile',user_profile);
app.use('/wifi_password',wifi_password);
app.use('/vulneraibility',vulnerability);
// catch 404 and forward to error handler
/**use the middleware**/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/**next jump to here**/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end();
});

module.exports = app;
