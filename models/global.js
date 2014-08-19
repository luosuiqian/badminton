var util = require('util');

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

