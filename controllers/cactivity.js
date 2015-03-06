var Global = require('../models/global');

var request = function (Activity) {
  var ret = new Object();
  ret.get = function (req, res) {
    Activity.getAuthority(req.session.user, function(authority) {
      Activity.checkTime();
      Activity.getAll(function(table) {
        Activity.getStudentid(req.session.user, function(result) {
          res.render('activity.jade', {
            user: req.session.user,
            flash: req.flash(),
            open: Activity.checkTime(),
            time: Activity.getTime(),
            authority: authority,
            table: table,
            result: result,
          });
        });
      });
    });
  };
  ret.post = function(req, res) {
    if (Activity.checkTime() == false) {
      req.flash('warning', '现在不是报名时间');
      return res.redirect('.');
    }
    Activity.getAuthority(req.session.user, function(authority) {
      if (authority == false) {
        req.flash('warning', '抱歉，您不是会员，不能预约');
        return res.redirect('/');
      }
      if (req.body.type == 'delete') {
        Activity.del(req.session.user, function() {
          req.flash('info', '取消报名成功');
          return res.redirect('back');
        });
      } else if (req.body.type == 'post') {
        Activity.save(req.body.timespace, req.session.user, function(err) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('back');
          } else {
            req.flash('info', '报名成功');
            return res.redirect('back');
          }
        });
      }
    });
  };
  return ret;
};

exports.official1 = function () {
  return request(Global.getOfficial1());
}

exports.official2 = function () {
  return request(Global.getOfficial2());
}

exports.activityGet = function(req, res) {
  res.render('activityClosed.jade', {
    user: req.session.user,
    flash: req.flash(),
  });
};

