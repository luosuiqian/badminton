/*
create table if not exists user
(
    studentid INT,
    password VARCHAR(100),
    name VARCHAR(20),
    sex CHAR(1),
    departmentid INT,
    email VARCHAR(100),
    phone VARCHAR(15),
    renrenid VARCHAR(15),
    privilege INT,
    primary key(studentid)
) character set utf8;
*/

var conn = require('./db').getConnection;

const maxDepartmentid = require('./global').maxDepartmentid;

var User = function (body) {
  this.studentid = body.studentid;
  this.password = body.password;
  this.name = body.name;
  this.sex = body.sex;
  this.departmentid = parseInt(body.departmentid);
  this.email = body.email;
  this.phone = body.phone;
  this.renrenid = body.renrenid;
  this.privilege = 0;
}

var check = function (user) {
  if (/^\d{10,10}$/.test(user.studentid) == false) {
    return ("学号错误");
  }
  if (/^.{1,100}$/.test(user.password) == false) {
    if (user.password.length == 0) {
      return ("密码不能为空");
    } else {
      return ("密码太长");
    }
  }
  if (/^.{1,20}$/.test(user.name) == false) {
    if (user.name.length == 0) {
      return ("姓名不能为空");
    } else {
      return ("姓名太长");
    }
  }
  if (user.sex != 'f' && user.sex != 'm') {
    return ("性别错误");
  }
  if (!(1 <= user.departmentid && user.departmentid <= maxDepartmentid)) {
    return ("院系错误");
  }
  if (/^.{0,100}$/.test(user.email) == false) {
    return ("邮箱太长");
  }
  if (/^.{0,15}$/.test(user.phone) == false) {
    return ("手机号码太长");
  }
  if (/^\d{0,15}$/.test(user.renrenid) == false) {
    return ("人人id错误");
  }
  return null;
}

exports.get = function (studentid, callback) {
  if (studentid == null) {
    return callback(null, null);
  }
  conn().query('SELECT * FROM user WHERE studentid = ?',
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

exports.save = function (body, callback) {
  var user = new User(body);
  var str = check(user);
  if (str != null) {
    return callback(str);
  }
  exports.get(user.studentid, function(err, results) {
    if (err) {
      return callback(err);
    }
    if (results.length > 0) {
      return callback("该学号已注册");
    }
    conn().query('INSERT INTO user SET ?', user, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  });
};

exports.update = function (body, callback) {
  var user = new User(body);
  var str = check(user);
  if (str != null) {
    return callback(str);
  }
  conn().query('UPDATE user SET ? WHERE studentid = ?',
               [user, user.studentid], function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

