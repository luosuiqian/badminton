var util = require('util');
var Activity = require('./activity');

//===========================================================================//

var getTime = function (beginTime, endTime) {
  var str = util.format(
    '%d年%d月%d日 %d:00 至 %d年%d月%d日 %d:%d',
    beginTime.getFullYear(),
    beginTime.getMonth() + 1,
    beginTime.getDate(),
    beginTime.getHours(),
    endTime.getFullYear(),
    endTime.getMonth() + 1,
    endTime.getDate(),
    endTime.getHours(),
    endTime.getMinutes()
  );
  if (endTime.getMinutes() == 0) {
    str += '0';
  }
  return str;
};

//===========================================================================//

exports.maxDepartmentid = 38;

//===========================================================================//

exports.id = 4;
exports.maxTime = 7;
exports.maxPeople = 10;
exports.maxSpace = 4;
exports.beginHour = 10;
exports.beginMinute = 15;
exports.period = 15;

var applicationBeginTime = new Date(2015, 9-1, 21, 13, 0, 0);
var applicationEndTime = new Date(2015, 9-1, 26, 22, 0, 0);

exports.checkTimeForApplication = function () {
  var now = new Date();
  return (applicationBeginTime <= now && now <= applicationEndTime);
};

exports.getTimeForApplication = function () {
  return getTime(applicationBeginTime, applicationEndTime);
};

//===========================================================================//

exports.getOfficial1 = function () {
  return Activity.Activity(21, 4, 6, 2, 5,
    new Date(2015,3-1,3,13,0,0),
    new Date(2015,3-1,5,13,0,0),
    new Date(2015,3-1,5,15,0,0),
    '清华综体', [7,8,9,10]
  );
};

exports.getOfficial2 = function () {
  return Activity.Activity(22, 4, 6, 2, 5,
    new Date(2015,3-1,6,13,0,0),
    new Date(2015,3-1,8,12,0,0),
    new Date(2015,3-1,8,14,0,0),
    '清华综体', [7,8,9,10]
  );
};

//===========================================================================//

var individual2014BeginTime = new Date(2014, 5-1, 18, 0, 0, 0);
var individual2014EndTime = new Date(2014, 6-1, 1, 22, 0, 0);
var individual2015BeginTime = new Date(2015, 5-1, 16, 13, 0, 0);
var individual2015EndTime = new Date(2015, 5-1, 24, 23, 59, 0);

exports.checkTimeForIndApply = function (year) {
  var now = new Date();
  if (year == 2014) {
    return (individual2014BeginTime <= now && now <= individual2014EndTime);
  } else if (year == 2015) {
    return (individual2015BeginTime <= now && now <= individual2015EndTime);
  } else {
    return false;
  }
};

exports.getTimeForIndApply = function (year) {
  if (year == 2014) {
    return getTime(individual2014BeginTime, individual2014EndTime);
  } else if (year == 2015) {
    return getTime(individual2015BeginTime, individual2015EndTime);
  }
};

//===========================================================================//

var team2014BeginTime = new Date(2014, 11-1, 13, 13, 0, 0);
var team2014EndTime = new Date(2014, 11-1, 30, 22, 0, 0);
var team2015BeginTime = new Date(2015, 11-1, 7, 13, 0, 0);
var team2015EndTime = new Date(2015, 11-1, 14, 22, 0, 0);

exports.checkTimeForTeamApply = function (year) {
  var now = new Date();
  if (year == 2014) {
    return (team2014BeginTime <= now && now <= team2014EndTime);
  }
  if (year == 2015) {
    return (team2015BeginTime <= now && now <= team2015EndTime);
  } else {
    return false;
  }
};

exports.getTimeForTeamApply = function (year) {
  if (year == 2014) {
    return getTime(team2014BeginTime, team2014EndTime);
  }
  if (year == 2015) {
    return getTime(team2015BeginTime, team2015EndTime);
  }
};

//===========================================================================//

var dayid = 0;
var signTime = new Date(2014, 9-1, 1, 0, 0, 0);
exports.getDayid = function () {
  var now = new Date();
  while (signTime < now) {
    dayid = dayid + 1;
    signTime.setTime(signTime.getTime() + (24 * 60 * 60 * 1000));
  }
  return dayid;
};

