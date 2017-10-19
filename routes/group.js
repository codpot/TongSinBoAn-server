var express = require('express');
var group = require('../db/group');
var member = require('../db/member');
var router = express.Router();

// 그룹 생성
router.post('/', function (req, res) {
  if (req.session.member_idx) {
    member.read_idx(req.session.member_idx, function (result, data) {
      if (data[0]['level'] === 0) {
        group_create(req, res, req.body.name, req.session.member_idx);
      } else {
        res.json({'result': false, 'msg': 'group_exists'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 그룹 가입
router.post('/join', function (req, res) {
  if (req.session.member_idx) {
    member.read_idx(req.session.member_idx, function (result, data) {
      if (data[0]['level'] === 0) {
        group_join(req, res, req.session.member_idx, req.body.group_idx, 0);
      } else {
        res.json({'result': false, 'msg': 'group_exists'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// # 그룹 생성
var group_create = function (req, res, name, member_idx) {
  group.create(name, member_idx, function (group_idx) {
    if (group_idx) {
      group_join(req, res, member_idx, group_idx, 3);
    } else {
      res.json({'result': false, 'msg': 'group_create_failed'});
    }
  });
};

// # 그룹 가입
var group_join = function (req, res, member_idx, group_idx, level) {
  member.update(member_idx, {'group_idx': group_idx, 'level': level}, function (i_result) {
    if (i_result) {
      req.session.group_idx = group_idx;
      req.session.level = level;
      res.json({'result': true});
    } else {
      res.json({'result': false, 'msg': 'group_join_failed'});
    }
  });
};

module.exports = router;
