var Global = require('../models/global');
var List = require('../models/list');
var Authority = require('../models/authority');
var Sign = require('../models/sign');
var User = require('../models/user');

exports.signGet = function(req, res) {
  Authority.getAuthority(req.session.user, 3, function(err, authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
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
        List.getAll(3, 4, function(err, list3) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          res.render('sign.jade', {
            name: 'sign',
            user: req.session.user,
            flash: req.flash(),
            list1: list1,
            list2: list2,
            list3: list3,
          });
        });
      });
    });
  });
};

exports.signStuGet = function(req, res) {
  Authority.getAuthority(req.session.user, 3, function(err, authority) {
    if (authority == false) {
      return res.render('signNoAuth.jade', {
        name: 'sign',
        user: req.session.user,
        flash: req.flash(),
        studentid: req.params.id,
      });
    }
    var studentid = parseInt(req.params.id);
    Authority.getInfo(studentid, req.params.psw, function(err, result) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/sign');
      }
      var dayid = Global.getDayid();
      Sign.get(studentid, dayid, function(err, bsign) {
        res.render('signWithAuth.jade', {
          name: 'sign',
          user: req.session.user,
          flash: req.flash(),
          result: result,
          bsign: bsign,
        });
      });
    });
  });
};

exports.signStuSigninGet = function(req, res) {
  Authority.getAuthority(req.session.user, 3, function(err, authority) {
    if (authority == false) {
      return res.render('signNoAuth.jade', {
        name: 'sign',
        user: req.session.user,
        flash: req.flash(),
        studentid: req.params.id,
      });
    }
    var studentid = parseInt(req.params.id);
    Authority.getInfo(studentid, req.params.psw, function(err, result) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/sign');
      }
      var dayid = Global.getDayid();
      Sign.set(studentid, dayid, function(err) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/sign');
        }
        return res.redirect('/sign/' + req.params.id + '/' + req.params.psw);
      });
    });
  });
};

exports.signStuPost = function(req, res) {
  Authority.getAuthority(req.session.user, 4, function(err, authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限更改');
      return res.redirect('.');
    }
    var studentid = parseInt(req.params.id);
    Authority.getInfo(studentid, req.params.psw, function(err, result) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/sign');
      }
      var money = parseInt(req.body.money);
      Authority.setMoney(studentid, money, req.session.user, function(err) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/sign');
        }
        return res.redirect('/sign/' + req.params.id + '/' + req.params.psw);
      });
    });
  });
};

exports.qucodeGet = function(req, res) {
  User.get(req.session.user, function(err, result) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    res.render('qrcode.jade', {
      name: 'sign',
      user: req.session.user,
      flash: req.flash(),
      result: result,
    });
  });
};

