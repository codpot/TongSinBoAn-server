var db = require('./index');

// 정책 생성
exports.create = function (group_idx, name, comment, mdm, callback) {
  db.query("INSERT INTO `policy` (group_idx, name, comment, mdm) VALUES (?, ?, ?, ?);", [group_idx, name, comment, mdm], function (error, results) {
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

// 정책 조회 (인덱스)
exports.read_idx = function (policy_idx, callback) {
  db.query("SELECT * FROM `policy` WHERE `idx` = ?;", [policy_idx], function (error, results) {
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
  db.query("SELECT * FROM `policy_admin` WHERE `policy_idx` = ? AND `member_idx` = ?;", [policy_idx, member_idx], function (error, results) {
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
