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

exports.id = 2;
exports.maxTime = 6;
exports.maxPeople = 10;
exports.maxSpace = 8;
exports.beginHour = 10;
exports.beginMinute = 15;
exports.period = 15;

var applicationBeginTime = new Date(2014, 9-1, 19, 13, 0, 0);
var applicationEndTime = new Date(2014, 10-1, 17, 16, 0, 0);
  
exports.checkTimeForApplication = function () {
  var now = new Date();
  return (applicationBeginTime <= now && now <= applicationEndTime);
};

exports.getTimeForApplication = function () {
  return getTime(applicationBeginTime, applicationEndTime);
};

//===========================================================================//

exports.getCrowd1 = function () {
  return Activity.Activity(11, 4, 6, 1, 4,
    new Date(2014,10-1,21,13,0,0),
    new Date(2014,10-1,23,11,30,0),
    new Date(2014,10-1,23,13,0,0),
    '清华综体', [1,2,3,4]
  );
};

exports.getCrowd2 = function () {
  return Activity.Activity(12, 4, 6, 1, 4,
    new Date(2014,10-1,21,13,0,0),
    new Date(2014,10-1,23,13,0,0),
    new Date(2014,10-1,23,14,0,0),
    '清华综体', [1,2,3,4]
  );
};

exports.getCrowd3 = function () {
  return Activity.Activity(13, 4, 6, 1, 4,
    new Date(2014,10-1,21,13,0,0),
    new Date(2014,10-1,23,14,0,0),
    new Date(2014,10-1,23,15,0,0),
    '清华综体', [1,2,3,4]
  );
};

exports.getOfficial = function () {
  return Activity.Activity(14, 8, 6, 2, 4,
    new Date(2014,10-1,23,13,0,0),
    new Date(2014,10-1,25,20,0,0),
    new Date(2014,10-1,25,22,0,0),
    '清华综体', [1,2,3,4,5,6,7,8]
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

var team2014BeginTime = new Date(2014, 11-1, 17, 13, 0, 0);
var team2014EndTime = new Date(2014, 11-1, 23, 16, 0, 0);

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

