var Global = require('../models/global');
var TeamAuth = require('../models/teamAuth');
var TeamApply = require('../models/teamApply');
var TeamUser = require('../models/teamUser');
var TeamMatch = require('../models/teamMatch');
var Authority = require('../models/authority');

exports.applyGet = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  TeamAuth.getList(year, function(departments) {
    res.render('teamApply.jade', {
      user: req.session.user,
      flash: req.flash(),
      year: year,
      departments: departments,
      time: Global.getTimeForTeamApply(year),
    });
  });
};

exports.applyDepGet = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var dep = parseInt(req.params.dep);
  if (!(1 <= dep && dep <= Global.maxDepartmentid)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  TeamAuth.get(year, dep, req.session.user, function(auth) {
    if (auth == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('back');
    }
    TeamApply.get(year, dep, function(results) {
      res.render('teamApplyList.jade', {
        user: req.session.user,
        flash: req.flash(),
        year: year,
        dep: dep,
        results: results,
        open: Global.checkTimeForTeamApply(year),
        time: Global.getTimeForTeamApply(year),
      });
    });
  });
};

exports.applyDepIdGet = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var dep = parseInt(req.params.dep);
  if (!(1 <= dep && dep <= Global.maxDepartmentid)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var id = parseInt(req.params.id);
  if (!(11 <= id && id <= 16 || 21 <= id && id <= 26 || id == 31)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  if (Global.checkTimeForTeamApply(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/');
  }
  TeamAuth.get(year, dep, req.session.user, function(auth) {
    if (auth == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('back');
    }
    TeamApply.get(year, dep, function(results) {
      res.render('teamApplyId.jade', {
        user: req.session.user,
        flash: req.flash(),
        year: year,
        dep: dep,
        id: id,
        results: results,
      });
    });
  });
};

exports.applyDepIdPost = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var dep = parseInt(req.params.dep);
  if (!(1 <= dep && dep <= Global.maxDepartmentid)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var id = parseInt(req.params.id);
  if (!(11 <= id && id <= 16 || 21 <= id && id <= 26 || id == 31)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  TeamAuth.get(year, dep, req.session.user, function(auth) {
    if (auth == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    TeamApply.save(year, dep, id, req.body, function(err) {
      if (err) {
        req.flash('warning', '修改失败： ' + err.toString());
        return res.redirect('.');
      } else {
        req.flash('info', '修改成功');
        return res.redirect('.');
      }
    });
  });
};

exports.userListGet = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2013 && year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  TeamUser.get(year, function(table) {
    res.render('teamUserList.jade', {
      user: req.session.user,
      flash: req.flash(),
      year: year,
      table: table,
    });
  });
};

exports.resultsGet = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2013 && year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var type = parseInt(req.params.type);
  if (!(1 <= type && type <= 5)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  TeamMatch.get(year, type, function(tables) {
    res.render('teamResults.jade', {
      user: req.session.user,
      flash: req.flash(),
      year: year,
      type: type,
      tables: tables,
      team: 'ABCDEFGH',
    });
  });
};

exports.resultsGetDetails = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2013 && year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var type = parseInt(req.params.type);
  if (!(1 <= type && type <= 5)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var teamId = parseInt(req.params.teamId);
  var left = parseInt(req.params.left);
  var right = parseInt(req.params.right);
  TeamMatch.getDetails(year, type, teamId, left, right, function(results) {
    if (results.length == 0) {
      req.flash('warning', 'URL错误');
      return res.redirect('/');
    }
    res.render('teamDetails.jade', {
      user: req.session.user,
      flash: req.flash(),
      year: year,
      type: type,
      results: results,
    });
  });
};

exports.adminListGet = function (req, res) {
  var year = parseInt(req.params.year);
  if (year != 2014) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    TeamUser.getAll(year, 1, function(list1) {
      TeamUser.getAll(year, 2, function(list2) {
        TeamUser.getAll(year, 3, function(list3) {
          res.render('list.jade', {
            user: req.session.user,
            flash: req.flash(),
            type: 'teamUser',
            list1: list1,
            list2: list2,
            list3: list3,
          });
        });
      });
    });
  });
};

