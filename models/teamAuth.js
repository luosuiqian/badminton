/*
create table if not exists teamAuth
(
    year INT,
    dep INT,
    stu INT,
    primary key(year, dep, stu)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (year, dep, studentid, callback) {
  conn().query('select stu from teamAuth \
                where year = ? and dep = ? and stu = ?',
                [year, dep, studentid], function(err, results) {
    if (err) {
      return callback(err, false);
    }
    if (results.length == 0) {
      return callback(null, false);
    }
    return callback(null, true);
  });
};

