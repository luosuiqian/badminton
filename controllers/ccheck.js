var Global = require('../models/global');
var Log = require('../models/log');
var Authority = require('../models/authority');

exports.log = function (req, res, next) {
  Log.log(req.ip, req.url, req.method, req.session.user);
  next();
};

exports.error = function (err, req, res, next) {
  console.log(err.stack);
  next(err);
};

exports.notFound = function (req, res, next) {
  res.send('Sorry, 404!');
};

exports.checkLogin = function (req, res, next) {
  if (req.session.user == null) {
    req.flash('warning', '请先登录');
    return res.redirect('/login?redirect=' + req.url);
  }
  next();
};

exports.checkNotLogin = function (req, res, next) {
  if (req.session.user != null) {
    req.flash('warning', '请先登出');
    return res.redirect('/');
  }
  next();
};

exports.checkAuthority = function (begin, end) {
  return function (req, res, next) {
    Authority.getAuthority(req.session.user, begin, end, function (authority) {
      if (authority == false) {
        req.flash('warning', '抱歉，您没有权限查看');
        return res.redirect('/');
      }
      next();
    });
  };
};

exports.checkYear = function (begin, end) {
  return function (req, res, next) {
    var year = parseInt(req.params.year);
    if (!(begin <= year && year <= end)) {
      req.flash('warning', 'URL错误, 年份错误');
      return res.redirect('/');
    }
    next();
  };
};

exports.checkTeamDep = function (req, res, next) {
  var dep = parseInt(req.params.dep);
  if (!(1 <= dep && dep <= Global.maxDepartmentid)) {
    req.flash('warning', 'URL错误, 院系不符');
    return res.redirect('/');
  }
  next();
};

exports.checkTeamId = function (req, res, next) {
  var id = parseInt(req.params.id);
  if (!(11 <= id && id <= 16 || 21 <= id && id <= 26 || id == 31)) {
    req.flash('warning', 'URL错误，teamid错误');
    return res.redirect('/');
  }
  next();
};

exports.checkTeamType = function (req, res, next) {
  var type = parseInt(req.params.type);
  if (!(1 <= type && type <= 5)) {
    req.flash('warning', 'URL错误，teamtype错误');
    return res.redirect('/');
  }
  next();
};

exports.checkIndTypeWithReferee = function (req, res, next) {
  var type = parseInt(req.params.type);
  if (!(type == 1 || type == 3 || type == 4 || type == 5 || type == 9)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  next();
};

exports.checkIndTypeWithoutReferee = function (req, res, next) {
  var type = parseInt(req.params.type);
  if (!(type % 10 == 1 || type % 10 == 3 || type % 10 == 4 || type % 10 == 5)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  next();
};

