var db = require('./index');

// 정책 생성
exports.create = function (group_idx, name, comment, mdm, callback) {
  db.query("INSERT INTO `policy` (`group_idx`, `name`, `comment`, `mdm`) VALUES (?, ?, ?, ?);", [group_idx, name, comment, mdm], function (error, results, fields) {
    if (!error) {
      callback(true, 'success');
    } else {
      callback(false, 'policy_create_failed');
    }
  });
};

// 정책 수정
exports.update = function (policy_idx, name, comment, mdm, callback) {
  db.query("UPDATE `policy` SET `name`=?, `comment`=?, `mdm`=? WHERE  `idx`=?;", [name, comment, mdm, policy_idx], function (error, results, fields) {
    if (!error) {
      callback(true, 'success');
    } else {
      callback(false, 'policy_update_failed');
    }
  });
};

// 정책 검증 권한 확인
exports.check_auth = function (policy_idx, member_idx, callback) {
  db.query("SELECT * FROM `policy_admin` WHERE `policy_idx` = ? AND `member_idx` = ?;", [policy_idx, member_idx], function (error, results, fields) {
    if (!error && results.length === 1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

// 정책 검증
exports.verify = function (policy_idx, token, now, callback) {
  db.query("SELECT p.* FROM `policy_user` as p WHERE p.policy_idx = ? AND p.member_idx = (SELECT m.idx FROM `member` as m WHERE m.token=? AND m.token_valid >= ?);", [policy_idx, token, now], function (error, results, fields) {
    if (!error && results.length === 1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};
