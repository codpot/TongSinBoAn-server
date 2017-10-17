var db = require('./index');

// 그룹 생성
exports.create = function (name, admin_idx, callback) {
  db.query("INSERT INTO `group` (name, admin_idx) VALUES (?, ?);", [name, admin_idx], function (error, results) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};

// 그룹 수정
exports.update = function (group_idx, value, callback) {
  db.query("UPDATE `group` SET ? WHERE idx=?;", [value, group_idx], function (error, results) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};
