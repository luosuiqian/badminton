var Global = require('../models/global');
var User = require('../models/user');
var Application = require('../models/application');

exports.applicationGet = function(req, res) {
  User.get(req.session.user, function(userinfo) {
    Application.getAll(function(table) {
      Application.getStudentid(req.session.user, function(result) {
        res.render('application.jade', {
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
    Application.del(req.session.user, function() {
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

