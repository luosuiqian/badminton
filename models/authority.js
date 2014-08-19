/*
create table if not exists authority
(
    studentid INT,
    rank INT,
    primary key(studentid)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (studentid, callback) {
  if (studentid == null) {
    return callback(null, null);
  }
  conn().query('SELECT * FROM authority WHERE studentid = ?',
               [studentid], function(err, results) {
    if (err) {
      return callback(err, null);
    } else if (results.length == 0) {
      return callback(null, null);
    } else {
      return callback(null, results[0]);
    }
  });
};

