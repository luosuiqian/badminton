var Global = require('../models/global');
var User = require('../models/user');
var Department = require('../models/department');
var IndApply = require('../models/indApply');
var IndMatch = require('../models/indMatch');

exports.individualGet = function (req, res) {
  var year = parseInt(req.params.year);
  User.get(req.session.user, function(userinfo) {
    IndApply.get(year, 1, function(mens_singles) {
      IndApply.get(year, 3, function(mens_doubles) {
        IndApply.get(year, 4, function(womens_doubles) {
          IndApply.get(year, 5, function(mixed_doubles) {
            IndApply.get(year, 9, function(referee) {
              res.render('individual' + year + '.jade', {
                user: req.session.user,
                flash: req.flash(),
                mens_singles: mens_singles,
                mens_doubles: mens_doubles,
                womens_doubles: womens_doubles,
                mixed_doubles: mixed_doubles,
                referee: referee,
                year: year,
                open: Global.checkTimeForIndApply(year),
                time: Global.getTimeForIndApply(year),
                sex: (userinfo != null) ? userinfo.sex : null,
              });
            });
          });
        });
      });
    });
  });
};

exports.individualApply = function (req, res) {
  var year = parseInt(req.params.year);
  var type = parseInt(req.params.type);
  if (Global.checkTimeForIndApply(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual/' + year);
  }
  User.get(req.session.user, function(userinfo) {
    Department.getAll(function(departments) {
      var p12 = IndApply.getP1andP2(type, userinfo);
      if (p12 == null) {
        req.flash('warning', '报名类型错误');
        return res.redirect('/individual/' + year);
      }
      res.render('individualApply.jade', {
        user: req.session.user,
        flash: req.flash(),
        departments: departments,
        year: year,
        type: type,
        player1: p12[0],
        player2: p12[1],
      });
    });
  });
};

exports.individualPost = function (req, res) {
  var year = parseInt(req.params.year);
  if (Global.checkTimeForIndApply(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual/' + year);
  }
  IndApply.save(year, req.body, req.session.user, function(err) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/individual/' + year);
    } else {
      req.flash('info', '报名成功');
      return res.redirect('/individual/' + year);
    }
  });
};

exports.individualCancel = function (req, res) {
  var year = parseInt(req.params.year);
  var type = parseInt(req.params.type);
  if (Global.checkTimeForIndApply(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual/' + year);
  }
  IndApply.del(year, req.session.user, type, function() {
    req.flash('info', '取消报名成功');
    return res.redirect('/individual/' + year);
  });
};

exports.individualResults = function (req, res) {
  var year = parseInt(req.params.year);
  var type = parseInt(req.params.type);
  IndMatch.get(year, type, function(table) {
    res.render('individualResults.jade', {
      user: req.session.user,
      flash: req.flash(),
      year: year,
      type: type,
      table: table,
    });
  });
};

