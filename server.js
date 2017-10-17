require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var group = require('./routes/group');
var log = require('./routes/log');
var member = require('./routes/member');
var policy = require('./routes/policy');

var app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  maxAge: 30 * 24 * 60 * 60 * 1000
}));

app.use(function (req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

app.use(function (req, res, next) {
  res.contentType('application/json');
  if (['POST', 'PUT'].indexOf(req.method) > -1 && !req.is('application/json')) {
    next(new Error);
  } else {
    next();
  }
});

app.use('/group', group);
app.use('/log', log);
app.use('/member', member);
app.use('/policy', policy);

app.use(function (req, res, next) {
  res.status(404).json({'result': false, 'msg': 'api_not_found'});
});

app.use(function (err, req, res, next) {
  res.status(500).json({'result': false, 'msg': 'internal_server_error'});
});

app.listen(process.env.PORT || 3000);
