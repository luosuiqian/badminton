var Global = require('../models/global');

var request = function (Activity) {
  var ret = new Object();
  ret.get = function (req, res) {
    Activity.getAuthority(req.session.user, function(err, authority) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      Activity.checkTime();
      Activity.getAll(function(err, table) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        Activity.getStudentid(req.session.user, function(err, result) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          res.render('activity.jade', {
            name: 'activity',
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
    Activity.getAuthority(req.session.user, function(err, authority) {
      if (authority == false) {
        req.flash('warning', '抱歉，您不是会员，不能预约');
        return res.redirect('/');
      }
      if (req.body.type == 'delete') {
        Activity.del(req.session.user, function(err) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('.');
          } else {
            req.flash('info', '取消报名成功');
            return res.redirect('.');
          }
        });
      } else if (req.body.type == 'post') {
        Activity.save(req.body.timespace, req.session.user, function(err) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('.');
          } else {
            req.flash('info', '报名成功');
            return res.redirect('.');
          }
        });
      }
    });
  };
  return ret;
};

exports.crowdThursday = function () {
  return request(Global.getCrowdThursday());
}

exports.crowdFriday = function () {
  return request(Global.getCrowdFriday());
}

exports.activityFriday = function () {
  return request(Global.getActivityFriday());
}

exports.activitySaturday = function () {
  return request(Global.getActivitySaturday());
}

exports.activityGet = function(req, res) {
  res.render('activityClosed.jade', {
    name: 'activity',
    user: req.session.user,
    flash: req.flash(),
  });
};

