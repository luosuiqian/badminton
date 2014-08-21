/*
create table if not exists indApply
(
    year INT,
    studentid INT,
    type INT,
    stu1 INT,
    nam1 VARCHAR(20),
    dep1 INT,
    ema1 VARCHAR(100),
    pho1 VARCHAR(15),
    stu2 INT,
    nam2 VARCHAR(20),
    dep2 INT,
    ema2 VARCHAR(100),
    pho2 VARCHAR(15),
    primary key(year, studentid, type)
) character set utf8;
*/

var conn = require('./db').getConnection;

const maxDepartmentid = require('./global').maxDepartmentid;

var NewApply = function (year,studentid,type,
                         stu1,nam1,dep1,ema1,pho1,
                         stu2,nam2,dep2,ema2,pho2) {
  this.year = year;
  this.studentid = studentid;
  this.type = parseInt(type);
  this.stu1 = stu1;
  this.nam1 = nam1;
  this.dep1 = parseInt(dep1);
  this.ema1 = ema1;
  this.pho1 = pho1;
  this.stu2 = stu2;
  this.nam2 = nam2;
  if (type == 1 || type == 9) {
    this.dep2 = null;
  } else {
    this.dep2 = parseInt(dep2);
  }
  this.ema2 = ema2;
  this.pho2 = pho2;
}

exports.get = function (year, type, callback) {
  conn().query('SELECT studentid, nam1, nam2 FROM indApply \
                WHERE year = ? and type = ?',
               [year, type], function(err, results) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, results);
    }
  });
};

function checkDetail(stu, nam, dep, ema, pho) {
  if (/^\d{10,10}$/.test(stu) == false) {
    return ("学号错误");
  }
  if (/^.{1,20}$/.test(nam) == false) {
    if (nam.length == 0 || nam.length == 0) {
      return ("姓名不能为空");
    } else {
      return ("姓名太长");
    }
  }
  if (!(1 <= dep && dep <= maxDepartmentid)) {
    return ("院系错误");
  }
  if (/^.{0,100}$/.test(ema) == false ) {
    return ("邮箱太长");
  }
  if (/^.{0,15}$/.test(pho) == false) {
    return ("手机号码太长");
  }
  return null;
}

function check(newApply) {
  if (newApply.type != 1 && newApply.type != 3 && newApply.type != 4
    && newApply.type != 5 && newApply.type != 9) {
    return ("比赛类型错误");
  }
  var r1 = checkDetail(newApply.stu1, newApply.nam1, newApply.dep1,
                       newApply.ema1, newApply.pho1);
  if (r1 != null) {
    return r1;
  }
  if (newApply.type == 1 || newApply.type == 9) {
    return null;
  }
  return checkDetail(newApply.stu2, newApply.nam2, newApply.dep2,
                     newApply.ema2, newApply.pho2);
}

exports.save = function (year, body, user, callback) {
  var newApply;
  if (parseInt(body.type) == 1 || parseInt(body.type) == 9) {
    newApply = new NewApply(
      year,
      user,
      body.type,
      body.studentid1,
      body.name1,
      body.departmentid1,
      body.email1,
      body.phone1,
      null, null, null, null, null
    );
  } else if (3 <= parseInt(body.type) && parseInt(body.type) <= 5) {
    newApply = new NewApply(
      year,
      user,
      body.type,
      body.studentid1,
      body.name1,
      body.departmentid1,
      body.email1,
      body.phone1,
      body.studentid2,
      body.name2,
      body.departmentid2,
      body.email2,
      body.phone2
    );
  }
  var str = check(newApply);
  if (str != null) {
    return callback(str);
  }
  conn().query('INSERT INTO indApply SET ?', newApply, function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};

exports.del = function (year, studentid, type, callback) {
  conn().query('DELETE FROM indApply \
                WHERE year = ? and studentid = ? and type = ?',
             [year, studentid, type],
             function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
}

var Player = function (userinfo) {
  this.studentid = userinfo.studentid;
  this.name = userinfo.name;
  this.sex = userinfo.sex;
  this.departmentid = parseInt(userinfo.departmentid);
  this.email = userinfo.email;
  this.phone = userinfo.phone;
  this.edit = false;
}

var NewPlayer = function (sex) {
  this.studentid = "";
  this.name = "";
  this.sex = sex;
  this.departmentid = 1;
  this.email = "";
  this.phone = "";
  this.edit = true;
}

exports.getP1andP2 = function (type, userinfo) {
  var sex = userinfo.sex;
  var p1 = null, p2 = null;
  if (type == 1 && sex == 'm') {
    p1 = new Player(userinfo);
  } else if (type == 3 && sex == 'm') {
    p1 = new Player(userinfo);
    p2 = new NewPlayer('m');
  } else if (type == 4 && sex == 'f') {
    p1 = new Player(userinfo);
    p2 = new NewPlayer('f');
  } else if (type == 5 && sex == 'm') {
    p1 = new Player(userinfo);
    p2 = new NewPlayer('f');
  } else if (type == 5 && sex == 'f') {
    p1 = new NewPlayer('m');
    p2 = new Player(userinfo);
  } else if (type == 9) {
    p1 = new Player(userinfo);
  } else {
    return null;
  }
  return [p1, p2];
}

