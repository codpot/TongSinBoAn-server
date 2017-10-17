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
