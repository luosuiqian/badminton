/*
create table if not exists authority
(
    studentid INT,
    rank INT,
    money INT,
    admin INT,
    primary key(studentid)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (studentid, callback) {
  if (studentid == null) {
    return callback(null);
  }
  conn().query('SELECT studentid, rank FROM authority WHERE studentid = ?',
               [studentid], function(err, results) {
    if (err) throw err;
    if (results.length == 0) {
      return callback(null);
    } else {
      return callback(results[0]);
    }
  });
};

exports.set = function (studentid, rank, callback) {
  conn().query('UPDATE authority SET rank = ? WHERE studentid = ?',
               [rank, studentid], function(err) {
    if (err) throw err;
    return callback();
  });
};

exports.setMoney = function (studentid, money, admin, callback) {
  conn().query('UPDATE authority SET money = ?, admin = ? WHERE studentid = ?',
               [money, admin, studentid], function(err) {
    if (err) throw err;
    return callback();
  });
};

exports.getInfo = function (studentid, prikey, callback) {
  conn().query('select user.studentid, name, rank, money, prikey from user \
                LEFT JOIN authority on user.studentid = authority.studentid \
                where user.studentid = ? and prikey = ?',
               [studentid, prikey], function(err, results) {
    if (err) throw err;
    if (results.length == 0) {
      callback(null);
    } else {
      callback(results[0]);
    }
  });
};

exports.getAuthority = function (studentid, num, callback) {
  if (studentid == null) {
    return callback(false);
  }
  exports.get(studentid, function(authority) {
    if (authority == null) {
      return callback(false);
    }
    if (authority.rank >= num) {
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

