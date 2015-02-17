var Authority = require('../models/authority');
var CurrentIndMatch = require('../models/currentIndMatch');
var util = require('util');

exports.refereeGet = function(req, res) {
  CurrentIndMatch.getAll(req.session.user, function(results) {
    res.render('referee.jade', {
      user: req.session.user,
      matches: util.inspect(results),
    });
  });
};

exports.matchGet = function(req, res) {
  var year = parseInt(req.params.year);
  var type = parseInt(req.params.type);
  var leftP = parseInt(req.params.leftP);
  var rightP = parseInt(req.params.rightP);
  CurrentIndMatch.getMatch(req.session.user, year,
                           type, leftP, rightP, function(result) {
    res.render('refereeMatch.jade', {
      user: req.session.user,
      match: util.inspect(result),
    });
  });
};

exports.matchPost = function(req, res) {
  var match = req.body.match;
  match.referee = req.session.user;
  CurrentIndMatch.updateMatch(match, function() {
    CurrentIndMatch.getMatch(match.referee, match.year, match.type,
                             match.leftP, match.rightP, function(results) {
      res.send(results);
    });
  });
};

exports.adminGet = function(req, res) {
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    CurrentIndMatch.adminGet(function(results) {
      res.render('refereeAdmin.jade', {
        user: req.session.user,
        matches: util.inspect(results),
      });
    });
  });
};

exports.adminPost = function(req, res) {
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    var newMatch = req.query.newMatch;
    CurrentIndMatch.adminPost(newMatch, function() {
      CurrentIndMatch.adminGet(function(results) {
        res.send(results);
      });
    });
  });
};

