var express = require('express');
var shajs = require('sha.js');
var md5 = require('md5');
var moment = require('moment');
var member = require('../db/member');
var router = express.Router();

// 회원 목록
router.get('/', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    member.read(req.session.group_idx, function (result, data) {
      if (result) {
        res.json({'result': true, 'data': data});
      } else {
        res.json({'result': false, 'msg': 'authentication_required'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 회원가입
router.post('/', function (req, res) {
  member.read_userid(req.body.userid, function (result) {
    if (!result) {
      member.create(req.body.userid, shajs('sha256').update(req.body.passwd).digest('hex'), req.body.name, function (m_result) {
        if (m_result) {
          res.json({'result': true});
        } else {
          res.json({'result': false, 'msg': 'member_create_failed'});
        }
      });
    } else {
      res.json({'result': false, 'msg': 'member_userid_exists'});
    }
  });
});

// 로그인
router.post('/login', function (req, res) {
  member.read_login(req.body.userid, shajs('sha256').update(req.body.passwd).digest('hex'), function (result, data) {
    if (result) {
      req.session.member_idx = data[0]['idx'];
      req.session.group_idx = data[0]['group_idx'];
      req.session.level = data[0]['level'];
      res.json({'result': true, 'data': data[0]});
    } else {
      res.json({'result': false, 'msg': 'member_login_failed'});
    }
  });
});

// 로그아웃
router.get('/logout', function (req, res) {
  if (req.session.member_idx) {
    req.session = null;
    res.json({'result': true});
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 토큰 발급
router.get('/token', function (req, res) {
  if (req.session.member_idx) {
    var token = md5(req.session.member_idx + Date.now());
    var expire = moment().add(process.env.TOKEN_EXPIRE, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    member.update(req.session.member_idx, {'token': token, 'token_valid': expire}, function (result) {
      if (result) {
        res.json({'result': true, 'data': {'token': token, 'expire': expire}});
      } else {
        res.json({'result': false, 'msg': 'member_token_create_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

module.exports = router;
