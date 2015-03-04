var Authority = require('../models/authority');
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
  if (!year || !type || !leftP || !rightP) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
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
  if (!year || !type || !leftP || !rightP) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
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
  if (year != 2015) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    res.render('refereeAdmin.jade', {
      user: req.session.user,
      flash: req.flash(),
      year: year,
    });
  });
};

exports.adminUsersGet = function(req, res) {
  var year = parseInt(req.params.year);
  if (year != 2015) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    CurrentIndMatch.adminUsersGet(year, function(users) {
      return res.send(users);
    });
  });
};

exports.adminMatchesGet = function(req, res) {
  var year = parseInt(req.params.year);
  if (year != 2015) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    CurrentIndMatch.adminMatchesGet(year, function(matches) {
      return res.send(matches);
    });
  });
};

exports.adminRefereesGet = function(req, res) {
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    CurrentIndMatch.adminRefereesGet(function(referees) {
      return res.send(referees);
    });
  });
};

exports.adminPost = function(req, res) {
  var year = parseInt(req.params.year);
  if (year != 2015) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  Authority.getAuthority(req.session.user, 3, 4, function(authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    var match = req.body.match;
    var type = req.body.type;
    CurrentIndMatch.adminPost(match, type, function() {
      res.redirect(req.url);
    });
  });
};

