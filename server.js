require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var db = require('./db');

var group = require('./routes/group');
var member = require('./routes/member');
var policy = require('./routes/policy');
var upload = require('./routes/upload');

var app = express();
var sessionStore = new MySQLStore({'expiration': process.env.SESSION_EXPIRE * 1000}, db);

app.use(session({
  key: 'session',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.disable('x-powered-by');
app.use('/upload', upload);
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.contentType('application/json');
  if (['POST', 'PUT'].indexOf(req.method) > -1 && !req.is('application/json')) {
    next(new Error);
  } else {
    next();
  }
});

app.use('/group', group);
app.use('/member', member);
app.use('/policy', policy);

app.use(function (req, res, next) {
  res.status(404).json({'result': false, 'msg': 'api_not_found'});
});

app.use(function (err, req, res, next) {
  res.status(500).json({'result': false, 'msg': 'internal_server_error'});
});

app.listen(process.env.PORT || 3000);
