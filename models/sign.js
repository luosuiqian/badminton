/*
create table if not exists sign
(
    studentid INT,
    dayid INT,
    primary key(studentid, dayid)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.set = function (studentid, dayid, callback) {
  conn().query('insert into sign values (?, ?)',
               [studentid, dayid], function(err) {
    if (err) throw err;
    return callback();
  });
};

exports.get = function (studentid, dayid, callback) {
  conn().query('select studentid from sign where studentid = ? and dayid = ?',
               [studentid, dayid], function(err, result) {
    if (err) throw err;
    if (result.length == 0) {
      return callback(false);
    } else {
      return callback(true);
    }
  });
};

