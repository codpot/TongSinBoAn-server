var db = require('./index');

// 회원가입
exports.create = function (userid, passwd, name, callback) {
  userid_exists(userid, function (result) {
    if (!result) {
      db.query("INSERT INTO `member` (`userid`, `passwd`, `name`) VALUES (?, ?, ?);", [userid, passwd, name], function (error, results, fields) {
        if (!error) {
          callback(true, 'success');
        } else {
          callback(false, 'member_create_failed');
        }
      });
    } else {
      callback(false, 'userid_already_exists');
    }
  });
};

// 로그인
exports.login = function (userid, passwd, callback) {
  db.query("SELECT m.idx, m.name, m.group_idx, g.name as group_name, m.group_ok, m.level, m.enabled, m.regdate FROM `member` AS m LEFT JOIN `group` AS g ON m.group_idx = g.idx WHERE m.userid = ? AND m.passwd = ?;", [userid, passwd], function (error, results, fields) {
    if (!error && results.length === 1) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 아이디 중복확인
var userid_exists = function (userid, callback) {
  db.query("SELECT `idx` FROM `member` WHERE `userid` = ?;", [userid], function (error, results, fields) {
    if (!error && results.length === 1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};
