var express = require('express');
var policy = require('../db/policy');
var router = express.Router();

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

module.exports = router;
