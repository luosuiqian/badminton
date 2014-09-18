/*
create table if not exists authority
(
    studentid INT,
    rank INT,
    money INT,
    primary key(studentid)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (studentid, callback) {
  if (studentid == null) {
    return callback(null, null);
  }
  conn().query('SELECT studentid, rank FROM authority WHERE studentid = ?',
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

exports.set = function (studentid, rank, callback) {
  conn().query('UPDATE authority SET rank = ? WHERE studentid = ?',
               [rank, studentid], function(err) {
    return callback(err);
  });
};

exports.setMoney = function (studentid, money, callback) {
  conn().query('UPDATE authority SET money = ? WHERE studentid = ?',
               [money, studentid], function(err) {
    return callback(err);
  });
};

exports.getInfo = function (studentid, prikey, callback) {
  conn().query('select user.studentid, name, rank, money, prikey from user,authority\
                where user.studentid = ? and authority.studentid = user.studentid and prikey = ?',
               [studentid, prikey], function(err, results) {
    if (err) {
      return callback(err, null);
    }
    if (results.length == 0) {
      callback('二维码错误！', null);
    } else {
      callback(null, results[0]);
    }
  });
};

exports.getAuthority = function (studentid, num, callback) {
  if (studentid == null) {
    return callback(null, false);
  }
  exports.get(studentid, function(err, authority) {
    if (err) {
      return callback(err, false);
    }
    if (authority == null) {
      return callback(null, false);
    }
    if (authority.rank >= num) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  });
};

