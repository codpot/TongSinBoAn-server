var db = require('./index');

// 정책 생성
exports.create = function (group_idx, name, comment, mdm_camera, mdm_mic, mdm_gps, mdm_wifi, mdm_hotspot, mdm_bluetooth, callback) {
  db.query("INSERT INTO `policy` (group_idx, name, comment, mdm_camera, mdm_mic, mdm_gps, mdm_wifi, mdm_hotspot, mdm_bluetooth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", [group_idx, name, comment, mdm_camera, mdm_mic, mdm_gps, mdm_wifi, mdm_hotspot, mdm_bluetooth], function (error, results) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};

// 정책을 적용받는 회원 추가
exports.create_policy_user = function (policy_idx, member_idx, callback) {
  db.query("INSERT INTO `policy_user` (policy_idx, member_idx) VALUES (?, ?);", [policy_idx, member_idx], function (error, results) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};

// 정책 관리자 추가
exports.create_policy_admin = function (policy_idx, member_idx, callback) {
  db.query("INSERT INTO `policy_admin` (policy_idx, member_idx) VALUES (?, ?);", [policy_idx, member_idx], function (error, results) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};

// 정책 조회 (유저)
exports.read_user = function (member_idx, callback) {
  db.query("SELECT p.* FROM `policy` AS p WHERE p.idx IN (SELECT u.policy_idx FROM policy_user AS u WHERE u.member_idx = ?);", [member_idx], function (error, results) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책 조회 (어드민)
exports.read_admin = function (member_idx, callback) {
  db.query("SELECT p.* FROM `policy` AS p WHERE p.idx IN (SELECT a.policy_idx FROM policy_admin AS a WHERE a.member_idx = ?);", [member_idx], function (error, results) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책 조회 (마스터)
exports.read_master = function (group_idx, callback) {
  db.query("SELECT * FROM `policy` WHERE group_idx = ?;", [group_idx], function (error, results) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책을 적용받는 회원 조회
exports.read_policy_user = function (policy_idx, callback) {
  db.query("SELECT p.*, m.userid, m.name, m.belong, m.profile_img FROM `policy_user` AS p LEFT JOIN `member` AS m ON p.member_idx = m.idx WHERE p.policy_idx = ?;", [policy_idx], function (error, results) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책 관리자 조회
exports.read_policy_admin = function (policy_idx, callback) {
  db.query("SELECT p.*, m.userid, m.name, m.belong, m.profile_img FROM `policy_admin` AS p LEFT JOIN `member` AS m ON p.member_idx = m.idx WHERE p.policy_idx = ?;", [policy_idx], function (error, results) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책 조회 (인덱스)
exports.read_idx = function (policy_idx, callback) {
  db.query("SELECT * FROM `policy` WHERE idx = ?;", [policy_idx], function (error, results) {
    if (!error && results.length === 1) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책 조회 (검증)
exports.read_verify = function (policy_idx, token, now, callback) {
  db.query("SELECT p.*, u.member_idx, u.chgdate FROM `policy` as p, `policy_user` as u WHERE p.idx = u.policy_idx AND u.policy_idx = ? AND u.member_idx = (SELECT m.idx FROM `member` as m WHERE m.token=? AND m.token_valid >= ?);", [policy_idx, token, now], function (error, results) {
    if (!error && results.length === 1) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 정책 조회 (검증 권한)
exports.read_verify_auth = function (policy_idx, member_idx, callback) {
  db.query("SELECT * FROM `policy_admin` WHERE policy_idx = ? AND member_idx = ?;", [policy_idx, member_idx], function (error, results) {
    if (!error && results.length === 1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

// 정책 수정
exports.update = function (policy_idx, value, callback) {
  db.query("UPDATE `policy` SET ? WHERE idx=?;", [value, policy_idx], function (error, results) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};

// 정책 삭제
exports.delete = function (policy_idx, callback) {
  db.query("DELETE FROM `policy` WHERE idx=?;", [policy_idx], function (error, results) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};

// 정책을 적용받는 회원 삭제
exports.delete_policy_user = function (policy_idx, member_idx, callback) {
  db.query("DELETE FROM `policy_user` WHERE policy_idx=? AND member_idx=?;", [policy_idx, member_idx], function (error, results) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};

// 정책 관리자 삭제
exports.delete_policy_admin = function (policy_idx, member_idx, callback) {
  db.query("DELETE FROM `policy_admin` WHERE policy_idx=? AND member_idx=?;", [policy_idx, member_idx], function (error, results) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};
