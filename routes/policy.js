var express = require('express');
var moment = require('moment');
var member = require('../db/member');
var policy = require('../db/policy');
var router = express.Router();

// 정책 목록
router.get('/', function (req, res) {
  if (req.session.member_idx) {
    policy.read_user(req.session.member_idx, function (result, data) {
      if (result) {
        res.json({'result': true, 'data': data});
      } else {
        res.json({'result': false, 'msg': 'policy_read_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 생성
router.post('/', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.create(req.session.group_idx, req.body.name, req.body.comment, req.body.mdm, function (result) {
      if (result) {
        res.json({'result': true});
      } else {
        res.json({'result': false, 'msg': 'policy_create_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 수정
router.put('/:policy_idx', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.update(req.params.policy_idx, {'name': req.body.name, 'comment': req.body.comment, 'mdm': req.body.mdm}, function (result) {
      if (result) {
        res.json({'result': true});
      } else {
        res.json({'result': false, 'msg': 'policy_update_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 목록 (관리자)
router.get('/admin', function (req, res) {
  if (req.session.member_idx && req.session.level >= 2) {
    if (req.session.level === 3) {
      policy.read_master(req.session.group_idx, function (result, data) {
        if (result) {
          res.json({'result': true, 'data': data});
        } else {
          res.json({'result': false, 'msg': 'policy_read_failed'});
        }
      });
    } else {
      policy.read_admin(req.session.member_idx, function (result, data) {
        if (result) {
          res.json({'result': true, 'data': data});
        } else {
          res.json({'result': false, 'msg': 'policy_read_failed'});
        }
      });
    }
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 검증
router.post('/verify/:policy_idx', function (req, res) {
  if (req.session.member_idx && req.session.level >= 2) {
    policy.read_verify_auth(req.params.policy_idx, req.session.member_idx, function (result) {
      if (result) {
        policy_verify(res, req.params.policy_idx, req.body.token);
      } else {
        res.json({'result': false, 'msg': 'authentication_required'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// # 출입증 검증
var policy_verify = function (res, policy_idx, token) {
  var now = moment().format('YYYY-MM-DD HH:mm:ss');
  policy.read_verify(policy_idx, token, now, function (result, data) {
    if (result) {
      var change = {'token_valid': '0000-00-00 00:00:00'};
      if (data[0]['mdm'] !== null) {
        change['enabled'] = data[0]['mdm'];
      }
      member.update(data[0]['member_idx'], change, function (result) {
        if (result) {
          res.json({'result': true});
        } else {
          res.json({'result': false, 'msg': 'policy_verify_failed'});
        }
      });
    } else {
      res.json({'result': false, 'msg': 'no_permission'});
    }
  });
};

module.exports = router;
