var conn = require('./db').getConnection;

const id = 1;
const maxTime = 60;
const maxSpace = 6;
const beginHour = 20;
const beginMinute = 15;
const period = 15;

exports.checkTime = function () {
  var now = new Date();
  var beginTime = new Date(2014,2-1,22,0,0,0);
  var deadline = new Date(2014,3-1,7,20,0,0);
  return (beginTime <= now && now <= deadline);
}

var Application = function (time,space,studentid) {
  this.id = id;
  this.time = parseInt(time);
  this.space = parseInt(space);
  this.studentid = studentid;
  this.chosen = 0;
}

exports.get = function (time, space, callback) {
  conn().query('SELECT * FROM application WHERE id = ? and time = ? and space = ?',
             [id, time, space], function(err, results) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, results);
    }
  });
};

exports.getStudentid = function (studentid, callback) {
  if (studentid == null) {
    return callback(null, null);
  }
  conn().query('SELECT time,space FROM application WHERE id = ? and studentid = ?',
             [id, studentid], function(err, results) {
    if (err) {
      return callback(err, null);
    } else {
      if (results.length == 0) {
        return callback(null, null);
      }
      return callback(null, results[0]);
    }
  });
};

exports.getAll = function (callback) {
  conn().query('SELECT time,space,name,chosen,renrenid FROM application,user\
             WHERE id = ? and application.studentid = user.studentid',
             [id], function(err, results) {
    if (err) {
      return callback(err, null);
    }
    var table = new Array(maxTime);
    for (var i=0;i<maxTime;i++) {
      table[i] = new Array(maxSpace);
      for (var j=0;j<maxSpace;j++) {
        table[i][j] = null;
      }
      var ii = parseInt(i/(maxTime/maxSpace));
      var h1 = beginHour + parseInt((beginMinute + ii * period) / 60);
      var m1 = (beginMinute + ii * period) % 60;
      var h2 = beginHour + parseInt((beginMinute + (ii + 1) * period) / 60);
      var m2 = (beginMinute + (ii + 1) * period) % 60;
      if (m1 < 10) m1 = '0' + m1;
      if (m2 < 10) m2 = '0' + m2;
      table[i].time = h1 + ':' + m1 + ' - ' + h2 + ':' + m2;
    }
    for (var i in results) {
      var result = results[i];
      table[result.time][result.space] = result;
    }
    return callback(null, table);
  });
};

exports.save = function (timespace, user, callback) {
  var time = parseInt(timespace / 100);
  var space = parseInt(timespace % 100);
  var application = new Application(time, space, user);
  if (!(0 <= application.time && application.time < maxTime)) {
    return callback("时间\场地错误，请重新选择");
  }
  if (!(0 <= application.space && application.space < maxSpace)) {
    return callback("时间\场地错误，请重新选择");
  }
  exports.getStudentid(application.studentid, function(err, results) {
    if (err) {
      return callback(err);
    }
    if (results != null) {
      return callback("您已经成功报名，请不要多次提交");
    }
    exports.get(application.time, application.space, function(err, results) {
      if (err) {
        return callback(err);
      }
      if (results.length > 0) {
        return callback("该场次已被预定，请重新选择");
      }
      conn().query('INSERT INTO application SET ?', application, function(err) {
        if (err) {
          return callback(err);
        } else {
          return callback(null);
        }
      });
    });
  });
};

exports.del = function (studentid, callback) {
  conn().query('DELETE FROM application WHERE id = ? and studentid = ?',
             [id, studentid],
             function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
}

