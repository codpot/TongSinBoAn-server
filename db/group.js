var db = require('./index');

// 그룹 생성
exports.create = function (name, admin_idx, callback) {
  db.query("INSERT INTO `group` (`name`, `admin_idx`) VALUES (?, ?);", [name, admin_idx], function (error, results, fields) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};

// 그룹 수정
exports.update = function (idx, value, callback) {
  db.query("UPDATE `group` SET ? WHERE `idx`=?;", [value, idx], function (error, results, fields) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};

// 그룹 할당
exports.assign = function (member_idx, group_idx, level, ok, callback) {
  db.query("UPDATE `member` SET `group_idx`=?, `level`=?, `group_ok`=? WHERE  `idx`=?;", [group_idx, level, ok, member_idx], function (error, results, fields) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};
