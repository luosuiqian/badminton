var Statistics = require('../models/statistics');

var getInfo = function (list, ret) {
  for (var i = 0; i < list.length; i++) {
    ret.name = list[i].name;
    if (ret.dep.indexOf(list[i].dep) == -1) {
      ret.dep.push(list[i].dep);
    }
  }
};

exports.get = function (req, res) {
  var superId = parseInt(req.params.superId);
  if (isNaN(superId)) {
    req.flash('warning', 'URL错误');
    return res.redirect('/');
  }
  Statistics.getTeam(superId, function(err, team) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Statistics.getInd(superId, function(err, ind) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      var info = {name: '', dep:[]};
      getInfo(team, info);
      getInfo(ind, info);
      res.render('statistics.jade', {
        name: 'statistics',
        user: req.session.user,
        flash: req.flash(),
        superId: superId,
        team: team,
        ind: ind,
        info: info,
      });
    });
  });
};

