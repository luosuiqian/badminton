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
  Statistics.getTeam(superId, function(team) {
    Statistics.getInd(superId, function(ind) {
      var info = {name: '', dep:[]};
      getInfo(team, info);
      getInfo(ind, info);
      res.render('statistics.jade', {
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

