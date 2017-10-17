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

// 정책 목록
exports.read = function (member_idx, callback) {
  db.query("SELECT p.* FROM `policy` AS p WHERE p.idx IN (SELECT u.policy_idx AS idx FROM policy_user AS u WHERE u.member_idx = ?);", [member_idx], function (error, results, fields) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false, 'policy_read_failed');
    }
  });
};

// 정책 목록 (마스터)
exports.read_master = function (group_idx, callback) {
  db.query("SELECT * FROM `policy` WHERE group_idx = ?;", [group_idx], function (error, results, fields) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false, 'policy_read_failed');
    }
  });
};

// 정책 목록 (어드민)
exports.read_admin = function (member_idx, callback) {
  db.query("SELECT * FROM `policy` AS p WHERE p.idx IN (SELECT a.policy_idx AS idx FROM policy_admin AS a WHERE a.member_idx = ?);", [member_idx], function (error, results, fields) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false, 'policy_read_failed');
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
      callback(true, results[0]['member_idx']);
    } else {
      callback(false);
    }
  });
};

// MDM 설정
exports.mdm = function (policy_idx, member_idx) {
  db.query("SELECT * FROM `policy` WHERE `idx` = ?;", [policy_idx], function (error, results, fields) {
    if (results[0]['mdm'] === 1) {
      db.query("UPDATE `member` SET `enabled`=? WHERE  `idx`=?;", [1, member_idx]);
    } else if (results[0]['mdm'] === 0) {
      db.query("UPDATE `member` SET `enabled`=? WHERE  `idx`=?;", [0, member_idx]);
    }
  });
};

// 토큰 비활성화
exports.destroy_token = function (member_idx) {
  db.query("UPDATE `member` SET `token_valid`='0000-00-00 00:00:00' WHERE  `idx`=?;", [member_idx]);
};
