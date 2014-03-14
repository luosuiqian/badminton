var util = require('util');
var conn = require('./db');
var Authority = require('./authority');

exports.Activity = function (time, space, table, autL, autR, begin, end, pla) {
  var maxTime = time;
  var maxSpace = space;
  var id = 0;
  var beginTime = begin;
  var endTime = end;
  var tableName = table;
  var autLeft = autL;
  var autRight = autR;
  var place = pla;
  
  var ret = new Object();
  
  ret.checkTime = function () {
    var now = new Date();
    while (endTime < now) {
      id = id + 1;
      beginTime.setTime(beginTime.getTime() + (7 * 24 * 60 * 60 * 1000));
      endTime.setTime(endTime.getTime() + (7 * 24 * 60 * 60 * 1000));
    }
    return (beginTime <= now && now <= endTime);
  };
  
  ret.getTime = function () {
    var ans = new Object();
    ans.time = util.format(
      '%d年%d月%d日 %d:00-%d:00',
      endTime.getFullYear(),
      endTime.getMonth() + 1,
      endTime.getDate(),
      endTime.getHours() - 2,
      endTime.getHours()
    );
    ans.appTime = util.format(
      '%d月%d日 %d:00 至 %d月%d日 %d:00',
      beginTime.getMonth() + 1,
      beginTime.getDate(),
      beginTime.getHours(),
      endTime.getMonth() + 1,
      endTime.getDate(),
      endTime.getHours()
    );
    ans.place = place;
    return ans;
  };
  
  ret.Activity = function (time, space, studentid) {
    this.id = id;
    this.time = parseInt(time);
    this.space = parseInt(space);
    this.studentid = studentid;
  };
  
  ret.get = function (time, space, callback) {
    conn().query('SELECT * FROM ' + tableName + ' WHERE id = ? and time = ? and space = ?',
              [id, time, space], function(err, results) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, results);
      }
    });
  };
  
  ret.getStudentid = function (studentid, callback) {
    if (studentid == null) {
      return callback(null, null);
    }
    conn().query('SELECT time,space FROM ' + tableName + ' WHERE id = ? and studentid = ?',
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
  
  ret.getAll = function (callback) {
    conn().query('SELECT time,space,name,renrenid FROM ' + tableName + ',user\
              WHERE id = ? and ' + tableName + '.studentid = user.studentid',
              [id], function(err, results) {
      if (err) {
        return callback(err, null);
      }
      var table = new Array(maxTime);
      for (var i=0; i<maxTime; i++) {
        table[i] = new Array(maxSpace);
        for (var j=0; j<maxSpace; j++) {
          table[i][j] = null;
        }
      }
      for (var i in results) {
        var result = results[i];
        table[result.time][result.space] = result;
      }
      return callback(null, table);
    });
  };
  
  ret.save = function (activity, callback) {
    if (!(0 <= activity.time && activity.time < maxTime)) {
      return callback("时间\场地错误，请重新选择");
    }
    if (!(0 <= activity.space && activity.space < maxSpace)) {
      return callback("时间\场地错误，请重新选择");
    }
    ret.getStudentid(activity.studentid, function(err, results) {
      if (err) {
        return callback(err);
      }
      if (results != null) {
        return callback("您已经成功报名，请不要多次提交");
      }
      ret.get(activity.time, activity.space, function(err, results) {
        if (err) {
          return callback(err);
        }
        if (results.length > 0) {
          return callback("该场次已被预定，请重新选择");
        }
        conn().query('INSERT INTO ' + tableName + ' SET ?', [activity], function(err) {
          if (err) {
            return callback(err);
          } else {
            return callback(null);
          }
        });
      });
    });
  };
  
  ret.del = function (studentid, callback) {
    conn().query('DELETE FROM ' + tableName + ' WHERE id = ? and studentid = ?',
              [id, studentid],
              function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  };
  
  ret.getAuthority = function (studentid, callback) {
    if (studentid == null) {
      return callback(null, false);
    }
    Authority.get(studentid, function(err, authority) {
      if (err) {
        return callback(err, false);
      }
      if (authority.length == 0) {
        return callback(null, false);
      }
      if (autLeft <= authority[0].rank && authority[0].rank <= autRight) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  };
  
  return ret;
};
