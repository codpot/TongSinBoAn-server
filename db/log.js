var db = require('./index');

// 로그 생성
exports.create = function (member_idx, value, callback) {
  db.query("INSERT INTO `log` (member_idx, value) VALUES (?, ?);", [member_idx, value], function (error, results) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};
