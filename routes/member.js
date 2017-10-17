var express = require('express');
var shajs = require('sha.js');
var member = require('../db/member');
var router = express.Router();

// 회원가입
router.post('/', function (req, res) {
  member.create(req.body.userid, shajs('sha256').update(req.body.passwd).digest('hex'), req.body.name, function (result, msg) {
    res.json({'result': result, 'msg': msg});
  });
});

// 로그인
router.post('/login', function (req, res) {
  member.login(req.body.userid, shajs('sha256').update(req.body.passwd).digest('hex'), function (result, data) {
    if (result) {
      res.json({'result': true, 'data': data[0]});
    } else {
      res.json({'result': false, 'msg': 'login_failed'});
    }
  });
});

module.exports = router;
