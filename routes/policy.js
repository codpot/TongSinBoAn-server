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
    policy.create(req.session.group_idx, req.body.name, req.body.comment, req.body.mdm_camera, req.body.mdm_mic, req.body.mdm_gps, req.body.mdm_wifi, req.body.mdm_hotspot, req.body.mdm_bluetooth, function (result) {
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
    policy.update(req.params.policy_idx, {'name': req.body.name, 'comment': req.body.comment, 'mdm_camera': req.body.mdm_camera, 'mdm_mic': req.body.mdm_mic, 'mdm_gps': req.body.mdm_gps, 'mdm_wifi': req.body.mdm_wifi, 'mdm_hotspot': req.body.mdm_hotspot, 'mdm_bluetooth': req.body.mdm_bluetooth}, function (result) {
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

// 정책 삭제
router.delete('/:policy_idx', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.delete(req.params.policy_idx, function (result) {
      if (result) {
        res.json({'result': true});
      } else {
        res.json({'result': false, 'msg': 'policy_delete_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책을 적용받는 회원 조회
router.get('/:policy_idx/user', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.read_policy_user(req.params.policy_idx, function (result, data) {
      if (result) {
        res.json({'result': true, 'data': data});
      } else {
        res.json({'result': false, 'msg': 'policy_read_user_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책을 적용받는 회원 추가
router.post('/:policy_idx/user', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.create_policy_user(req.params.policy_idx, req.body.member_idx, function (result) {
      if (result) {
        res.json({'result': true});
      } else {
        res.json({'result': false, 'msg': 'policy_create_user_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책을 적용받는 회원 삭제
router.delete('/:policy_idx/user/:member_idx', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.delete_policy_user(req.params.policy_idx, req.params.member_idx, function (result) {
      if (result) {
        res.json({'result': true});
      } else {
        res.json({'result': false, 'msg': 'policy_delete_user_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 관리자 조회
router.get('/:policy_idx/admin', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.read_policy_admin(req.params.policy_idx, function (result, data) {
      if (result) {
        res.json({'result': true, 'data': data});
      } else {
        res.json({'result': false, 'msg': 'policy_read_admin_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 관리자 추가
router.post('/:policy_idx/admin', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.create_policy_admin(req.params.policy_idx, req.body.member_idx, function (result) {
      if (result) {
        member.update(req.body.member_idx, {'level': 2}, function (u_result) {
          if (u_result) {
            res.json({'result': true});
          } else {
            res.json({'result': false, 'msg': 'policy_member_update_failed'});
          }
        });
      } else {
        res.json({'result': false, 'msg': 'policy_create_admin_failed'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 정책 관리자 삭제
router.delete('/:policy_idx/admin/:member_idx', function (req, res) {
  if (req.session.member_idx && req.session.level === 3) {
    policy.delete_policy_admin(req.params.policy_idx, req.params.member_idx, function (result) {
      if (result) {
        res.json({'result': true});
      } else {
        res.json({'result': false, 'msg': 'policy_delete_admin_failed'});
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
        if (req.session.level === 3) {
          policy_verify(res, req.params.policy_idx, req.body.token);
        } else {
          res.json({'result': false, 'msg': 'authentication_required'});
        }
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
      if (data[0]['mdm_camera'] !== 2) {
        change['mdm_camera'] = data[0]['mdm_camera'];
      }
      if (data[0]['mdm_mic'] !== 2) {
        change['mdm_mic'] = data[0]['mdm_mic'];
      }
      if (data[0]['mdm_gps'] !== 2) {
        change['mdm_gps'] = data[0]['mdm_gps'];
      }
      if (data[0]['mdm_wifi'] !== 2) {
        change['mdm_wifi'] = data[0]['mdm_wifi'];
      }
      if (data[0]['mdm_hotspot'] !== 2) {
        change['mdm_hotspot'] = data[0]['mdm_hotspot'];
      }
      if (data[0]['mdm_bluetooth'] !== 2) {
        change['mdm_bluetooth'] = data[0]['mdm_bluetooth'];
      }
      member.update(data[0]['member_idx'], change, function (result) {
        if (result) {
          member.read_idx(data[0]['member_idx'], function (r_result, r_data) {
            if (r_result) {
              res.json({'result': true, 'data': r_data[0]});
            } else {
              res.json({'result': false, 'msg': 'policy_member_read_failed'});
            }
          });
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
