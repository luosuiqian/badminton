var Authority = require('../models/authority');
var Sign = require('../models/sign');
var User = require('../models/user');

exports.signAllGet = function(req, res) {
  Authority.getAll(1, 1, function(list1) {
    Authority.getAll(2, 2, function(list2) {
      Authority.getAll(3, 5, function(list3) {
        res.render('sign.jade', {
          user: req.session.user,
          flash: req.flash(),
          list1: list1,
          list2: list2,
          list3: list3,
        });
      });
    });
  });
};

exports.signInGet = function(req, res) {
  var studentid = parseInt(req.params.id);
  Authority.getInfo(studentid, req.params.psw, function(result) {
    if (result == null) {
      req.flash('warning', '信息错误');
      return res.redirect('/sign');
    }
    Sign.set(studentid, function() {
      return res.redirect('/sign');
    });
  });
};

exports.signStuGet = function(req, res) {
  var studentid = parseInt(req.params.id);
  Authority.getInfo(studentid, req.params.psw, function(result) {
    if (result == null) {
      req.flash('warning', '信息错误');
      return res.redirect('/sign');
    }
    Sign.get(studentid, function(bsign) {
      res.render('signWithAuth.jade', {
        user: req.session.user,
        flash: req.flash(),
        result: result,
        bsign: bsign,
      });
    });
  });
};

exports.signStuPost = function(req, res) {
  var studentid = parseInt(req.params.id);
  Authority.getInfo(studentid, req.params.psw, function(result) {
    if (result == null) {
      req.flash('warning', '信息错误');
      return res.redirect('/sign');
    }
    var money = parseInt(req.body.money);
    Authority.setMoney(studentid, money, req.session.user, function() {
      return res.redirect('/sign/' + req.params.id + '/' + req.params.psw);
    });
  });
};

