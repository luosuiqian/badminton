/*
create table if not exists teamApply
(
    year INT,
    dep INT,
    id INT,
    stu INT,
    nam VARCHAR(20),
    ema VARCHAR(100),
    pho VARCHAR(15),
    primary key(year, dep, id)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (year, dep, callback) {
  conn().query('SELECT id, stu, nam, ema, pho from teamApply \
                WHERE year = ? and dep = ?',
               [year, dep], function (err, results) {
    if (err) throw err;
    var ret = {};
    for (var i = 0; i < results.length; i++) {
      ret[results[i].id] = results[i];
    }
    return callback(ret);
  });
};

var NewApply = function (year, dep, id, stu, nam, ema, pho) {
  this.year = year;
  this.dep = dep;
  this.id = id;
  this.stu = stu;
  this.nam = nam;
  this.ema = ema;
  this.pho = pho;
};

function checkDetail(stu, nam, ema, pho) {
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
  if (/^.{0,100}$/.test(ema) == false ) {
    return ("邮箱太长");
  }
  if (/^.{0,15}$/.test(pho) == false) {
    return ("手机号码太长");
  }
  return null;
};

exports.save = function (year, dep, id, body, callback) {
  var newApply = new NewApply(year, dep, id,
                          body.stu, body.nam, body.ema, body.pho);
  var str = checkDetail(newApply.stu, newApply.nam,
                        newApply.ema, newApply.pho);
  if (str != null) {
    return callback(str);
  }
  conn().query('REPLACE INTO teamApply SET ?', newApply, function (err) {
    if (err) {
      console.log(err);
      return callback('操作失败，未知错误，请重试');
    }
    return callback(null);
  });
};

