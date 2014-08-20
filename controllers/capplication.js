var Global = require('../models/global');
var User = require('../models/user');
var Application = require('../models/application');

exports.applicationGet = function(req, res) {
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Application.getAll(function(err, table) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      Application.getStudentid(req.session.user, function(err, result) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        res.render('application.jade', {
          name: 'application',
          user: req.session.user,
          flash: req.flash(),
          open: Global.checkTimeForApplication(),
          time: Global.getTimeForApplication(),
          sex: (userinfo != null) ? userinfo.sex : null,
          table: table,
          result: result,
        });
      });
    });
  });
};

exports.applicationPost = function(req, res) {
  if (Global.checkTimeForApplication() == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/application');
  }
  if (req.body.type == 'delete') {
    Application.del(req.session.user, function(err) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/application');
      }
      req.flash('info', '取消报名成功');
      return res.redirect('/application');
    });
  } else if (req.body.type == 'post') {
    Application.save(req.body.timespace, req.session.user, function(err) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/application');
      } else {
        req.flash('info', '报名成功');
        return res.redirect('/application');
      }
    });
  }
};

