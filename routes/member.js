var express = require('express');
var shajs = require('sha.js');
var md5 = require('md5');
var moment = require('moment');
var member = require('../db/member');
var router = express.Router();

// 회원가입
router.post('/', function (req, res) {
  member.read_userid(req.body.userid, function (result) {
    if (!result) {
      member.create(req.body.userid, shajs('sha256').update(req.body.passwd).digest('hex'), req.body.name, function (m_result) {
        if (m_result) {
          res.json({'result': true, 'msg': 'success'});
        } else {
          res.json({'result': false, 'msg': 'member_create_failed'});
        }
      });
    } else {
      res.json({'result': false, 'msg': 'userid_already_exists'});
    }
  });
});

// 회원 목록
router.get('/', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    member.read(req.session.group_idx, function (result, data) {
      if (result) {
        res.json({'result': false, 'data': data});
      } else {
        res.json({'result': false, 'msg': 'login_required'});
      }
    });
  }
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
      res.json({'result': false, 'msg': 'login_failed'});
    }
  });
});

// 출입증 발급
router.get('/passport', function (req, res) {
  if (req.session.member_idx) {
    var token = md5(req.session.member_idx + Date.now());
    var expire = moment().add(60, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    member.update(req.session.member_idx, {'token': token, 'token_valid': expire}, function (result) {
      if (result) {
        res.json({'result': true, 'token': token, 'expire': expire});
      } else {
        res.json({'result': false, 'msg': 'passport_generate_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'login_required'});
  }
});

// 로그아웃
router.get('/logout', function (req, res) {
  if (req.session.member_idx) {
    req.session = null;
    res.json({'result': true});
  } else {
    res.json({'result': false, 'msg': 'login_required'});
  }
});

module.exports = router;
