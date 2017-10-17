var db = require('./index');

// 회원 생성
exports.create = function (userid, passwd, name, callback) {
  db.query("INSERT INTO `member` (userid, passwd, name) VALUES (?, ?, ?);", [userid, passwd, name], function (error, results) {
    if (!error) {
      callback(results.insertId);
    } else {
      callback(false);
    }
  });
};

// 회원 조회
exports.read = function (group_idx, callback) {
  db.query("SELECT m.idx, m.name, m.group_idx, g.name as group_name, m.group_ok, m.level, m.token, m.token_valid, m.enabled, m.regdate FROM `member` AS m LEFT JOIN `group` AS g ON m.group_idx = g.idx WHERE m.group_idx=?;", [group_idx], function (error, results) {
    if (!error) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 회원 조회 (인덱스)
exports.read_idx = function (member_idx, callback) {
  db.query("SELECT m.idx, m.name, m.group_idx, g.name as group_name, m.group_ok, m.level, m.token, m.token_valid, m.enabled, m.regdate FROM `member` AS m LEFT JOIN `group` AS g ON m.group_idx = g.idx WHERE m.idx=?;", [member_idx], function (error, results) {
    if (!error && results.length === 1) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 회원 조회 (아이디)
exports.read_userid = function (userid, callback) {
  db.query("SELECT idx FROM `member` WHERE userid = ?;", [userid], function (error, results) {
    if (!error && results.length === 1) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 회원 조회 (로그인)
exports.read_login = function (userid, passwd, callback) {
  db.query("SELECT m.idx, m.name, m.group_idx, g.name as group_name, m.group_ok, m.level, m.token, m.token_valid, m.enabled, m.regdate FROM `member` AS m LEFT JOIN `group` AS g ON m.group_idx = g.idx WHERE m.userid = ? AND m.passwd = ?;", [userid, passwd], function (error, results) {
    if (!error && results.length === 1) {
      callback(true, results);
    } else {
      callback(false);
    }
  });
};

// 회원 수정
exports.update = function (member_idx, value, callback) {
  db.query("UPDATE `member` SET ? WHERE idx=?;", [value, member_idx], function (error, results) {
    if (!error) {
      callback(Boolean(results.affectedRows));
    } else {
      callback(false);
    }
  });
};
