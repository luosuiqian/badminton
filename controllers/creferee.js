var CurrentIndMatch = require('../models/currentIndMatch');

exports.refereeGet = function(req, res) {
  CurrentIndMatch.refGet(req.session.user, function(referee) {
    CurrentIndMatch.matchGetAll(req.session.user, function(matches) {
      res.render('referee.jade', {
        user: req.session.user,
        flash: req.flash(),
        referee: referee,
        matches: matches,
      });
    });
  });
};

exports.refereeOn = function(req, res) {
  CurrentIndMatch.refOn(req.session.user, function() {
    res.redirect('/referee');
  });
};

exports.refereeOff = function(req, res) {
  CurrentIndMatch.refOff(req.session.user, function() {
    res.redirect('/referee');
  });
};

exports.matchIndex = function(req, res) {
  var year = parseInt(req.params.year);
  var type = parseInt(req.params.type);
  var leftP = parseInt(req.params.leftP);
  var rightP = parseInt(req.params.rightP);
  res.render('refereeMatch.jade', {
    user: req.session.user,
    flash: req.flash(),
    year: year,
    type: type,
    leftP: leftP,
    rightP: rightP,
  });
};

exports.matchGet = function(req, res) {
  var year = parseInt(req.params.year);
  var type = parseInt(req.params.type);
  var leftP = parseInt(req.params.leftP);
  var rightP = parseInt(req.params.rightP);
  CurrentIndMatch.matchGet(req.session.user, year, type,
                            leftP, rightP, function(results) {
    res.send(results);
  });
};

exports.matchPost = function(req, res) {
  var match = req.body.match;
  if (match == null) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  match.referee = req.session.user;
  CurrentIndMatch.matchUpdate(match, function() {
    exports.matchGet(req, res);
  });
};

exports.adminGet = function(req, res) {
  var year = parseInt(req.params.year);
  res.render('refereeAdmin.jade', {
    user: req.session.user,
    flash: req.flash(),
    year: year,
  });
};

exports.adminUsersGet = function(req, res) {
  var year = parseInt(req.params.year);
  CurrentIndMatch.adminUsersGet(year, function(users) {
    return res.send(users);
  });
};

exports.adminMatchesGet = function(req, res) {
  var year = parseInt(req.params.year);
  CurrentIndMatch.adminMatchesGet(year, function(matches) {
    return res.send(matches);
  });
};

exports.adminMatchesDoingGet = function(req, res) {
  var year = parseInt(req.params.year);
  CurrentIndMatch.adminMatchesDoingGet(year, function(matches) {
    return res.send(matches);
  });
};

exports.adminRefereesGet = function(req, res) {
  CurrentIndMatch.adminRefereesGet(function(referees) {
    return res.send(referees);
  });
};

exports.adminPost = function(req, res) {
  var match = req.body.match;
  var type = req.body.type;
  CurrentIndMatch.adminPost(match, type, function() {
    res.send({});
  });
};

exports.screenAllGet = function(req, res) {
  var year = parseInt(req.params.year);
  res.render('screenAll.jade', {
    user: req.session.user,
    flash: req.flash(),
    year: year,
  });
};

exports.screenOneIdGet = function(req, res) {
  var year = parseInt(req.params.year);
  var id = parseInt(req.params.id);
  res.render('screenOne.jade', {
    user: req.session.user,
    flash: req.flash(),
    year: year,
    id: id,
  });
};

