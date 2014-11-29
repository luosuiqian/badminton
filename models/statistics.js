var conn = require('./db').getConnection;

var getRound = function (total, left, right) {
  if (left == total && right == 1) {
    return '三四名';
  } else if (left == 1 && right == total) {
    return '决赛';
  } else if ((right-left+1)*2 == total) {
    return '半决赛';
  } else {
    var len = right - left + 1;
    var round = 1;
    while (len > 2) {
        len /= 2;
        round += 1;
    }
    return '第' + round + '轮';
  }
};

exports.getTeam = function (superId, callback) {
  conn().query('select teamMatch.year, type, teamId, leftP, rightP,\
                teamUser.name as name, dep0.name as dep,\
                dep1.name as dep12, dep2.name as dep34,\
                total12, total34, matchId, matchType,\
                team1.name as id1,\
                team2.name as id2,\
                team3.name as id3,\
                team4.name as id4,\
                team1.superId as superId1,\
                team2.superId as superId2,\
                team3.superId as superId3,\
                team4.superId as superId4,\
                score12, score34, detail from teamMatch join teamUser \
                left join teamUser as team1 on id1 = team1.id and teamMatch.year = team1.year \
                left join teamUser as team2 on id2 = team2.id and teamMatch.year = team2.year \
                left join teamUser as team3 on id3 = team3.id and teamMatch.year = team3.year \
                left join teamUser as team4 on id4 = team4.id and teamMatch.year = team4.year \
                left join department as dep1 on dep12 = dep1.id \
                left join department as dep2 on dep34 = dep2.id \
                left join department as dep0 on teamUser.dep = dep0.id \
                where teamUser.superId = ? and \
                (teamMatch.year = teamUser.year and id1 = teamUser.id \
                or teamMatch.year = teamUser.year and id2 = teamUser.id \
                or teamMatch.year = teamUser.year and id3 = teamUser.id \
                or teamMatch.year = teamUser.year and id4 = teamUser.id) \
                order by year desc, type desc, abs(rightP - leftP) desc',
                [superId], function(err, teamMatch) {
    if (err) {
      return callback(err, null);
    }
    for (var i = 0; i < teamMatch.length; i++) {
      teamMatch[i].round = getRound(teamMatch[i].teamId, teamMatch[i].leftP, teamMatch[i].rightP);
    }
    return callback(null, teamMatch);
  });
};

exports.getInd = function (superId, callback) {
  conn().query('SELECT indMatch.year, indMatch.type, totalP, leftP, rightP,\
                indUser.name as name, dep0.name as dep,\
                ind1.name as id1,\
                ind2.name as id2,\
                ind3.name as id3,\
                ind4.name as id4,\
                ind1.superId as superId1,\
                ind2.superId as superId2,\
                ind3.superId as superId3,\
                ind4.superId as superId4,\
                dep1.name as dep1,\
                dep2.name as dep2,\
                dep3.name as dep3,\
                dep4.name as dep4,\
                score12, score34, detail FROM indMatch join indUser \
                left join indUser as ind1 on id1 = ind1.id and indMatch.year = ind1.year and indMatch.type = ind1.type \
                left join indUser as ind2 on id2 = ind2.id and indMatch.year = ind2.year and indMatch.type = ind2.type \
                left join indUser as ind3 on id3 = ind3.id and indMatch.year = ind3.year and indMatch.type = ind3.type \
                left join indUser as ind4 on id4 = ind4.id and indMatch.year = ind4.year and indMatch.type = ind4.type \
                left join department as dep1 on ind1.dep = dep1.id \
                left join department as dep2 on ind2.dep = dep2.id \
                left join department as dep3 on ind3.dep = dep3.id \
                left join department as dep4 on ind4.dep = dep4.id \
                left join department as dep0 on indUser.dep = dep0.id \
                WHERE indUser.superId = ? and \
                (indMatch.year = indUser.year and indMatch.type = indUser.type and id1 = indUser.id \
                or indMatch.year = indUser.year and indMatch.type = indUser.type and id2 = indUser.id \
                or indMatch.year = indUser.year and indMatch.type = indUser.type and id3 = indUser.id \
                or indMatch.year = indUser.year and indMatch.type = indUser.type and id4 = indUser.id) \
                order by year desc, type asc, abs(rightP - leftP) desc',
                [superId], function(err, indMatch) {
    if (err) {
      return callback(err, null);
    }
    for (var i = 0; i < indMatch.length; i++) {
      indMatch[i].round = getRound(indMatch[i].totalP, indMatch[i].leftP, indMatch[i].rightP);
    }
    return callback(null, indMatch);
  });
};

