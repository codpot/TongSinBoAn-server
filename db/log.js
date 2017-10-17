var db = require('./index');

// 로그 생성
exports.logCreate = function (member_idx, value, callback) {
  db.query("INSERT INTO `tongsinboan`.`log` (`member_idx`, `value`) VALUES (?, ?);", [member_idx, value], function (error, results, fields) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};
