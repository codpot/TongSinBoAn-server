var express = require('express');
var moment = require('moment');
var policy = require('../db/policy');
var router = express.Router();

// [함수] 출입증 검증
var policy_verify = function (res, policy_idx, token) {
  var now = moment().format('YYYY-MM-DD HH:mm:ss');
  policy.verify(policy_idx, token, now, function (result, member_idx) {
    if (result) {
      policy.mdm(policy_idx, member_idx);
      policy.destroy_token(member_idx);
      res.json({'result': true, 'msg': 'success'});
    } else {
      res.json({'result': false, 'msg': 'no_permission'});
    }
  });
};

// 정책 생성
router.post('/', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.create(req.session.group_idx, req.body.name, req.body.comment, req.body.mdm, function (result, msg) {
      res.json({'result': result, 'msg': msg});
    });
  } else {
    res.json({'result': false, 'msg': 'login_required'});
  }
});

// 정책 수정
router.put('/:policy_idx', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.update(req.params.policy_idx, req.body.name, req.body.comment, req.body.mdm, function (result, msg) {
      res.json({'result': result, 'msg': msg});
    });
  } else {
    res.json({'result': false, 'msg': 'login_required'});
  }
});

// 정책 검증
router.post('/verify/:policy_idx', function (req, res) {
  if (req.session.member_idx && req.session.level >= 2) {
    policy.check_auth(req.params.policy_idx, req.session.member_idx, function (result) {
      if (result) {
        policy_verify(res, req.params.policy_idx, req.body.token);
      } else {
        res.json({'result': false, 'msg': 'login_required'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'login_required'});
  }
});

module.exports = router;
