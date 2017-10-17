var db = require('./index');

exports.create = function (group_idx, name, comment, mdm, callback) {
  db.query("INSERT INTO `policy` (`group_idx`, `name`, `comment`, `mdm`) VALUES (?, ?, ?, ?);", [group_idx, name, comment, mdm], function (error, results, fields) {
    if (!error) {
      callback(true, 'success');
    } else {
      callback(false, 'policy_create_failed');
    }
  });
};
