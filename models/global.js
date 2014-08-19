var util = require('util');
var Activity = require('./activity');

exports.maxDepartmentid = 36;

exports.id = 1;
exports.maxTime = 6;
exports.maxPeople = 10;
exports.maxSpace = 6;
exports.beginHour = 20;
exports.beginMinute = 15;
exports.period = 15;

var beginTime = new Date(2014, 2-1, 22, 13, 0, 0);
var endTime = new Date(2014, 3-1, 7, 20, 0, 0);
  
exports.checkTimeForApplication = function () {
  var now = new Date();
  return (beginTime <= now && now <= endTime);
}

exports.getTimeForApplication = function () {
  var str = util.format(
    '%d年%d月%d日 %d:00 至 %d年%d月%d日 %d:00',
    beginTime.getFullYear(),
    beginTime.getMonth() + 1,
    beginTime.getDate(),
    beginTime.getHours(),
    endTime.getFullYear(),
    endTime.getMonth() + 1,
    endTime.getDate(),
    endTime.getHours()
  );
  return str;
}

exports.getCrowdThursday = function (request) {
  return request(
    Activity.Activity(6, 6, 1, 1, 1,
      new Date(2014,3-1,11,13,0,0),
      new Date(2014,3-1,13,15,0,0),
      '清华综体', [1,2,3,4,5,6]
    )
  );
};

exports.getCrowdFriday = function (request) {
  return request(
    Activity.Activity(6, 3, 2, 1, 1,
      new Date(2014,3-1,12,13,0,0),
      new Date(2014,3-1,14,15,0,0),
      '清华综体', [3,4,5]
    )
  );
};

exports.getActivityFriday = function (request) {
  return request(
    Activity.Activity(6, 3, 3, 2, 3,
      new Date(2014,3-1,5,13,0,0),
      new Date(2014,3-1,7,15,0,0),
      '清华综体', [8,9,10]
    )
  );
};

exports.getActivitySaturday = function (request) {
  return request(
    Activity.Activity(6, 4, 4, 2, 3,
      new Date(2014,3-1,6,13,0,0),
      new Date(2014,9-1,8,22,0,0),
      '清华西体', [5,6,7,8]
    )
  );
};

