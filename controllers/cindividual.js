var Global = require('../models/global');
var User = require('../models/user');
var Department = require('../models/department');
var Individual = require('../models/individual');
var IndMatch = require('../models/indMatch');

exports.individualGet = function (req, res) {
  var yearStr = req.params.year;
  if (yearStr != '2014' && yearStr != '2015') {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  year = parseInt(yearStr);
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Individual.get(year, 1, function(err, mens_singles) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      Individual.get(year, 3, function(err, mens_doubles) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        Individual.get(year, 4, function(err, womens_doubles) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          Individual.get(year, 5, function(err, mixed_doubles) {
            if (err) {
              req.flash('warning', err.toString());
              return res.redirect('/');
            }
            Individual.get(year, 9, function(err, referee) {
              if (err) {
                req.flash('warning', err.toString());
                return res.redirect('/');
              }
              res.render('individual' + year + '.jade', {
                name: 'individual',
                user: req.session.user,
                flash: req.flash(),
                mens_singles: mens_singles,
                mens_doubles: mens_doubles,
                womens_doubles: womens_doubles,
                mixed_doubles: mixed_doubles,
                referee: referee,
                year: year,
                open: Global.checkTimeForIndividual(year),
                time: Global.getTimeForIndividual(year),
                sex: (userinfo != null) ? userinfo.sex : null,
              });
            });
          });
        });
      });
    });
  });
};

var getType = function (typeStr) {
  if (typeStr == 'mens_singles') {
    return 1;
  }
  if (typeStr == 'mens_doubles') {
    return 3;
  }
  if (typeStr == 'womens_doubles') {
    return 4;
  }
  if (typeStr == 'mixed_doubles') {
    return 5;
  }
  if (typeStr == 'referee') {
    return 9;
  }
  return null;
};

exports.individualApply = function (req, res) {
  var yearStr = req.params.year;
  var type = getType(req.params.type);
  if ((yearStr != '2014' && yearStr != '2015') || type == null) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  var year = parseInt(yearStr);
  if (Global.checkTimeForIndividual(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual/' + year);
  }
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Department.getAll(function(err, departments) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      var p12 = Individual.getP1andP2(type, userinfo);
      if (p12 == null) {
        req.flash('warning', '报名类型错误');
        return res.redirect('/');
      }
      res.render('individualApply.jade', {
        name: 'individual',
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
  var yearStr = req.params.year;
  if (yearStr != '2014' && yearStr != '2015') {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  year = parseInt(yearStr);
  if (Global.checkTimeForIndividual(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual/' + year);
  }
  Individual.save(year, req.body, req.session.user, function(err) {
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
  var yearStr = req.params.year;
  var type = getType(req.params.type);
  if ((yearStr != '2014' && yearStr != '2015') || type == null) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  year = parseInt(yearStr);
  if (Global.checkTimeForIndividual(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual/' + year);
  }
  Individual.del(year, req.session.user, type, function(err) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    req.flash('info', '取消报名成功');
    return res.redirect('/individual/' + year);
  });
};

exports.individualResults = function (req, res) {
  var yearStr = req.params.year;
  var type = getType(req.params.type);
  if ((yearStr != '2014') || type == null) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  year = parseInt(yearStr);
  IndMatch.get(year, type, function(err, table) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    res.render('individualResults.jade', {
      name: 'individual',
      user: req.session.user,
      flash: req.flash(),
      year: year,
      type: type,
      table: table,
    });
  });
};

