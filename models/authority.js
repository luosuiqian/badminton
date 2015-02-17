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
var Global = require('./global');

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

exports.getAuthority = function (studentid, autLeft, autRight, callback) {
  if (studentid == null) {
    return callback(false);
  }
  exports.get(studentid, function(authority) {
    if (autLeft <= authority.rank && authority.rank <= autRight) {
      return callback(true);
    } else {
      return callback(false);
    }
  });
};

exports.getAll = function (numberL, numberR, callback) {
  var dayid = Global.getDayid();
  conn().query("select user.studentid,user.name,\
                CASE WHEN sex = 'm' THEN '男' ELSE '女' END AS sex,\
                department.name as department,email,phone,prikey,money,sign.dayid\
                from authority,department,user \
                LEFT JOIN sign on user.studentid = sign.studentid and sign.dayid = ? \
                where user.departmentid = department.id\
                and user.studentid = authority.studentid\
                and ? <= authority.rank and authority.rank <= ?\
                order by sex desc, user.studentid",
              [dayid, numberL, numberR], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

exports.getAllNoAuthority = function (callback) {
  conn().query("select user.studentid,user.name,\
                CASE WHEN sex = 'm' THEN '男' ELSE '女' END AS sex,\
                department.name as department,email,phone\
                from user,department\
                where user.departmentid = department.id\
                and user.studentid NOT IN (SELECT studentid FROM authority)\
                order by user.sex desc, user.studentid",
              function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

