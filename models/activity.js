/*
create table if not exists activity
(
    num INT,
    id INT,
    time INT,
    space INT,
    studentid INT,
    primary key(num, id, time, space)
) character set utf8;
*/

var util = require('util');
var conn = require('./db').getConnection;
var Authority = require('./authority');

exports.Activity = function (table, space, time,
                             autL, autR, begin, begin2, end, pla, sNum) {
  var tableNum = table;
  var maxSpace = space;
  var maxTime = time;
  var id = 0;
  var beginTime = begin;
  var beginTime2 = begin2;
  var endTime = end;
  var autLeft = autL;
  var autRight = autR;
  var place = pla;
  var spaceNum = sNum;
  
  var ret = new Object();
  
  ret.checkTime = function () {
    var now = new Date();
    while (endTime < now) {
      id = id + 1;
      beginTime.setTime(beginTime.getTime() + (7 * 24 * 60 * 60 * 1000));
      beginTime2.setTime(beginTime2.getTime() + (7 * 24 * 60 * 60 * 1000));
      endTime.setTime(endTime.getTime() + (7 * 24 * 60 * 60 * 1000));
    }
    return (beginTime <= now && now <= endTime);
  };
  
  ret.getTime = function () {
    var ans = new Object();
    ans.time = util.format(
      '%d年%d月%d日 %d:%s-%d:%s',
      endTime.getFullYear(),
      endTime.getMonth() + 1,
      endTime.getDate(),
      beginTime2.getHours(),
      ("0" + beginTime2.getMinutes()).substr(-2),
      endTime.getHours(),
      ("0" + endTime.getMinutes()).substr(-2)
    );
    ans.appTime = util.format(
      '%d月%d日 %d:%s 至 %d月%d日 %d:%s',
      beginTime.getMonth() + 1,
      beginTime.getDate(),
      beginTime.getHours(),
      ("0" + beginTime.getMinutes()).substr(-2),
      endTime.getMonth() + 1,
      endTime.getDate(),
      endTime.getHours(),
      ("0" + endTime.getMinutes()).substr(-2)
    );
    ans.place = place;
    ans.spaceNum = spaceNum;
    return ans;
  };
  
  var Activity = function (time, space, studentid) {
    this.num = tableNum
    this.id = id;
    this.time = parseInt(time);
    this.space = parseInt(space);
    this.studentid = studentid;
  };
  
  ret.get = function (time, space, callback) {
    conn().query('SELECT studentid FROM activity \
                  WHERE num = ? and id = ? and time = ? and space = ?',
              [tableNum, id, time, space], function(err, results) {
      if (err) throw err;
      if (results.length == 0) {
        return callback(null);
      } else {
        return callback(results[0]);
      }
    });
  };
  
  ret.getStudentid = function (studentid, callback) {
    if (studentid == null) {
      return callback(null, null);
    }
    conn().query('SELECT time, space FROM activity \
                  WHERE num = ? and id = ? and studentid = ?',
              [tableNum, id, studentid], function(err, results) {
      if (err) throw err;
      if (results.length == 0) {
        return callback(null);
      } else {
        return callback(results[0]);
      }
    });
  };
  
  ret.getAll = function (callback) {
    conn().query('SELECT time,space,name,renrenid FROM activity, user\
              WHERE num = ? and id = ? and activity.studentid = user.studentid',
              [tableNum, id], function(err, results) {
      if (err) throw err;
      var table = new Array(maxTime);
      for (var i = 0; i < maxTime; i++) {
        table[i] = new Array(maxSpace);
        for (var j = 0; j < maxSpace; j++) {
          table[i][j] = null;
        }
      }
      for (var i in results) {
        var result = results[i];
        table[result.time][result.space] = result;
      }
      return callback(table);
    });
  };
  
  ret.save = function (timespace, user, callback) {
    var time = parseInt(timespace / 100);
    var space = parseInt(timespace % 100);
    var activity = new Activity(time, space, user);
    if ((!(0 <= activity.time && activity.time < maxTime))
      || (!(0 <= activity.space && activity.space < maxSpace))) {
      return callback("时间\场地错误，请重新选择");
    }
    ret.getStudentid(activity.studentid, function(results) {
      if (results != null) {
        return callback("您已经成功报名，请不要多次提交");
      }
      ret.get(activity.time, activity.space, function(results) {
        if (results != null) {
          return callback("该场次已被预定，请重新选择");
        }
        conn().query('INSERT INTO activity SET ?',
                     [activity], function(err) {
          if (err) {
            console.log(err);
            return callback('操作失败，未知错误，请重试');
          }
          return callback(null);
        });
      });
    });
  };
  
  ret.del = function (studentid, callback) {
    conn().query('DELETE FROM activity \
                  WHERE num = ? and id = ? and studentid = ?',
                 [tableNum, id, studentid], function(err) {
      if (err) throw err;
      return callback();
    });
  };
  
  ret.getAuthority = function (studentid, callback) {
    if (studentid == null) {
      return callback(false);
    }
    Authority.getAuthority(studentid, autLeft, autRight, function(authority) {
      return callback(authority);
    });
  };
  
  return ret;
};

