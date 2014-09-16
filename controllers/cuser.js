var Global = require('../models/global');
var User = require('../models/user');
var Department = require('../models/department');
var List = require('../models/list');
var Log = require('../models/log');
var Authority = require('../models/authority');

exports.log = function(req, res, next) {
  Log.log(req.ip, req.url, req.method, req.session.user);
  next();
};

exports.checkLogin = function (req, res, next) {
  if (req.session.user == null) {
    req.flash('warning', '请先登录');
    return res.redirect('/login');
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
    name: 'index',
    user: req.session.user,
    flash: req.flash(),
  });
};

exports.registerGet = function(req, res) {
  Department.getAll(function(err, departments) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    res.render('register.jade', {
      name: 'register',
      user: req.session.user,
      flash: req.flash(),
      departments: departments,
    });
  });
};

exports.registerPost = function(req, res) {
  if (req.body.password != req.body.repeatpassword) {
    req.flash('warning', '密码两次输入不一致，您可以用浏览器的后退功能重新填写表单');
    return res.redirect('/register');
  }
  User.save(req.body, function(err) {
    if (err) {
      req.flash('warning', err.toString() + '，您可以用浏览器的后退功能重新填写表单');
      return res.redirect('/register');
    } else {
      req.flash('info', '注册成功');
      return res.redirect('/login');
    }
  });
};

exports.editGet = function(req, res) {
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
      res.render('edit.jade', {
        name: 'edit',
        user: req.session.user,
        flash: req.flash(),
        departments: departments,
        userinfo: userinfo,
      });
    });
  });
};

exports.editPost = function(req, res) {
  User.get(req.session.user, function(err, userinfo) {
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
        return res.redirect('/');
      }
    });
  });
};

exports.loginGet = function(req, res) {
  res.render('login.jade', {
    name: 'login',
    user: req.session.user,
    flash: req.flash(),
  });
};

exports.loginPost = function(req, res) {
  User.get(req.body.studentid, function(err, userinfo) {
    if (userinfo == null || userinfo.password != req.body.password) {
      req.flash('warning', '学号或密码错误');
      return res.redirect('/login');
    }
    req.session.user = req.body.studentid;
    req.flash('info', '登录成功');
    return res.redirect('/');
  });
};

exports.logoutGet = function(req, res) {
  req.session.user = null;
  req.flash('info', '登出成功');
  return res.redirect('/');
};

exports.listGet = function(req, res) {
  List.getAuthority(req.session.user, function(err, authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    List.getAllNoAuthority(function(err, list0) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      List.getAll(1, 1, function(err, list1) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        List.getAll(2, 2, function(err, list2) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          List.getAll(3, 3, function(err, list3) {
            if (err) {
              req.flash('warning', err.toString());
              return res.redirect('/');
            }
            res.render('list.jade', {
              name: 'list',
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
    name: 'map',
    user: req.session.user,
    flash: req.flash(),
  });
};

exports.confirmGet = function(req, res) {
  Authority.get(req.session.user, function(err, result){
    res.render('confirm.jade', {
      name: 'application',
      user: req.session.user,
      flash: req.flash(),
      rank: result == null ? 0 : result.rank,
    });
  });
};

exports.confirmPost = function(req, res) {
  if (req.body.choice == 'y') {
    Authority.set(req.session.user, 3, function(err) {
      req.flash('info', '操作成功');
      return res.redirect('/confirm');
    });
  } else if (req.body.choice == 'n') {
    Authority.set(req.session.user, 1, function(err) {
      req.flash('info', '操作成功');
      return res.redirect('/confirm');
    });
  } else {
    req.flash('warning', '操作失败');
    return res.redirect('/confirm');
  }
};

