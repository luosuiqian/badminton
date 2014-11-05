var Statistics = require('../models/statistics');

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
      res.render('statistics.jade', {
        name: 'statistics',
        user: req.session.user,
        flash: req.flash(),
        superId: superId,
        team: team,
        ind: ind,
      });
    });
  });
};

