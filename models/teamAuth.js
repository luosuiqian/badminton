/*
create table if not exists teamAuth
(
    year INT,
    dep INT,
    type INT,
    stu INT,
    name VARCHAR(20),
    primary key(year, dep, type)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (year, dep, studentid, callback) {
  conn().query('select stu from teamAuth \
                where year = ? and dep = ? and stu = ?',
                [year, dep, studentid], function(err, results) {
    if (err) throw err;
    if (results.length == 0) {
      return callback(false);
    } else {
      return callback(true);
    }
  });
};

exports.getList = function (year, callback) {
  conn().query('select id, department.name, teamAuth.name as leader \
                from department left join teamAuth \
                on id = dep and year = ? and type = 0',
                [year], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

