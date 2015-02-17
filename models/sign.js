/*
create table if not exists sign
(
    studentid INT,
    dayid INT,
    primary key(studentid, dayid)
) character set utf8;
*/

var conn = require('./db').getConnection;
var Global = require('../models/global');

exports.set = function (studentid, callback) {
  var dayid = Global.getDayid();
  conn().query('insert ignore into sign values (?, ?)',
               [studentid, dayid], function(err) {
    if (err) throw err;
    return callback();
  });
};

exports.get = function (studentid, callback) {
  var dayid = Global.getDayid();
  conn().query('select studentid from sign where studentid = ? and dayid = ?',
               [studentid, dayid], function(err, result) {
    if (err) throw err;
    if (result.length == 0) {
      return callback(false);
    } else {
      return callback(true);
    }
  });
};

