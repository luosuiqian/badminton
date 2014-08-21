var util = require('util');
var Activity = require('./activity');

//===========================================================================//

var getTime = function (beginTime, endTime) {
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
};

//===========================================================================//

exports.maxDepartmentid = 36;

//===========================================================================//

exports.id = 1;
exports.maxTime = 6;
exports.maxPeople = 10;
exports.maxSpace = 6;
exports.beginHour = 20;
exports.beginMinute = 15;
exports.period = 15;

var applicationBeginTime = new Date(2014, 2-1, 22, 13, 0, 0);
var applicationEndTime = new Date(2014, 3-1, 7, 20, 0, 0);
  
exports.checkTimeForApplication = function () {
  var now = new Date();
  return (applicationBeginTime <= now && now <= applicationEndTime);
};

exports.getTimeForApplication = function () {
  return getTime(applicationBeginTime, applicationEndTime);
};

//===========================================================================//

exports.getCrowdThursday = function () {
  return Activity.Activity(1, 6, 6, 1, 1,
    new Date(2014,3-1,11,13,0,0),
    new Date(2014,3-1,13,15,0,0),
    '清华综体', [1,2,3,4,5,6]
  );
};

exports.getCrowdFriday = function () {
  return Activity.Activity(2, 3, 6, 1, 1,
    new Date(2014,3-1,12,13,0,0),
    new Date(2014,3-1,14,15,0,0),
    '清华综体', [3,4,5]
  );
};

exports.getActivityFriday = function () {
  return Activity.Activity(3, 3, 6, 2, 3,
    new Date(2014,3-1,5,13,0,0),
    new Date(2014,3-1,7,15,0,0),
    '清华综体', [8,9,10]
  );
};

exports.getActivitySaturday = function () {
  return Activity.Activity(4, 4, 6, 2, 3,
    new Date(2014,3-1,6,13,0,0),
    new Date(2014,3-1,8,22,0,0),
    '清华西体', [5,6,7,8]
  );
};

//===========================================================================//

var individual2014BeginTime = new Date(2014, 5-1, 18, 0, 0, 0);
var individual2014EndTime = new Date(2014, 6-1, 1, 22, 0, 0);
var individual2015BeginTime = new Date(2015, 5-1, 1, 13, 0, 0);
var individual2015EndTime = new Date(2015, 5-1, 16, 22, 0, 0);

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

var team2014BeginTime = new Date(2014, 11-1, 1, 13, 0, 0);
var team2014EndTime = new Date(2014, 11-1, 15, 22, 0, 0);

exports.checkTimeForTeamApply = function (year) {
  var now = new Date();
  if (year == 2014) {
    return (team2014BeginTime <= now && now <= team2014EndTime);
  } else {
    return false;
  }
};

exports.getTimeForTeamApply = function (year) {
  if (year == 2014) {
    return getTime(team2014BeginTime, team2014EndTime);
  }
};

