var Global = require('../models/global');
var User = require('../models/user');
var Department = require('../models/department');
var Log = require('../models/log');
var Authority = require('../models/authority');

exports.log = function(req, res, next) {
  Log.log(req.ip, req.url, req.method, req.session.user);
  next();
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

exports.indexGet = function(req, res) {
  res.render('index.jade', {
    user: req.session.user,
    flash: req.flash(),
  });
};

exports.registerGet = function(req, res) {
  Department.getAll(function(departments) {
    res.render('register.jade', {
      user: req.session.user,
      flash: req.flash(),
      departments: departments,
    });
  });
};

exports.registerPost = function(req, res) {
  if (req.body.password != req.body.repeatpassword) {
    req.flash('warning', '密码两次输入不一致');
    return res.redirect('/register');
  }
  User.save(req.body, function(err) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/register');
    } else {
      req.flash('info', '注册成功');
      return res.redirect('/login');
    }
  });
};

exports.editGet = function(req, res) {
  User.get(req.session.user, function(userinfo) {
    Department.getAll(function(departments) {
      res.render('edit.jade', {
        user: req.session.user,
        flash: req.flash(),
        departments: departments,
        userinfo: userinfo,
      });
    });
  });
};

exports.editPost = function(req, res) {
  User.get(req.session.user, function(userinfo) {
    if (userinfo.password != req.body.password) {
      req.flash('warning', '密码错误');
      return res.redirect('/edit');
    }
    if (req.body.newpassword != req.body.repeatpassword) {
      req.flash('warning', '新密码两次输入不一致');
      return res.redirect('/edit');
    }
    req.body.studentid = req.session.user;
    if (req.body.newpassword != '') {
      req.body.password = req.body.newpassword;
    }
    User.update(req.body, function(err) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/edit');
      } else {
        req.flash('info', '修改资料成功');
        return res.redirect('/edit');
      }
    });
  });
};

exports.loginGet = function(req, res) {
  res.render('login.jade', {
    user: req.session.user,
    flash: req.flash(),
  });
};

exports.loginPost = function(req, res) {
  User.get(req.body.studentid, function(userinfo) {
    if (userinfo == null || userinfo.password != req.body.password) {
      req.flash('warning', '学号或密码错误');
      return res.redirect('/login');
    }
    req.session.user = req.body.studentid;
    req.flash('info', '登录成功');
    var url = req.query.redirect;
    if (url == null) url = '/';
    return res.redirect(url);
  });
};

exports.logoutGet = function(req, res) {
  req.session.user = null;
  req.flash('info', '登出成功');
  return res.redirect('/');
};

exports.listGet = function(req, res) {
  Authority.getAuthority(req.session.user, 3, 5, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    Authority.getAllNoAuthority(function(list0) {
      Authority.getAll(1, 1, function(list1) {
        Authority.getAll(2, 2, function(list2) {
          Authority.getAll(3, 4, function(list3) {
            res.render('list.jade', {
              user: req.session.user,
              flash: req.flash(),
              list0: list0,
              list1: list1,
              list2: list2,
              list3: list3,
            });
          });
        });
      });
    });
  });
};

exports.mapGet = function(req, res) {
  res.render('map.jade', {
    user: req.session.user,
    flash: req.flash(),
  });
};

exports.confirmGet = function(req, res) {
  Authority.get(req.session.user, function(result){
    res.render('confirm.jade', {
      user: req.session.user,
      flash: req.flash(),
      rank: result == null ? -1 : result.rank,
    });
  });
};

exports.confirmPost = function(req, res) {
  if (req.body.choice == 'y') {
    Authority.set(req.session.user, 2, function() {
      req.flash('info', '操作成功');
      return res.redirect('/confirm');
    });
  } else if (req.body.choice == 'n') {
    Authority.set(req.session.user, 0, function() {
      req.flash('info', '操作成功');
      return res.redirect('/confirm');
    });
  } else {
    req.flash('warning', '操作失败');
    return res.redirect('/confirm');
  }
};

exports.registerCheckGet = function(req, res) {
  var studentid = parseInt(req.query.studentid);
  User.get(studentid, function(userinfo) {
    if (userinfo == null) {
      res.send({'valid': true});
    }
    else {
      res.send({'valid': false});
    }
  });
};

