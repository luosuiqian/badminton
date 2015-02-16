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

var swap = function (mat, s1, s2) {
  var tmp = mat[s1];
  mat[s1] = mat[s2];
  mat[s2] = tmp;
  return;
}

var handle = function (match, superId) {
  for (var i = 0; i < match.length; i++) {
    match[i].round = getRound(match[i].totalP, match[i].leftP, match[i].rightP);
  }
  for (var i = 0; i < match.length; i++) {
    if (superId == match[i].superId3 || superId == match[i].superId4) {
      swap(match[i], 'id1', 'id3');
      swap(match[i], 'id2', 'id4');
      swap(match[i], 'superId1', 'superId3');
      swap(match[i], 'superId2', 'superId4');
      swap(match[i], 'dep12', 'dep34');
      swap(match[i], 'dep1', 'dep3');
      swap(match[i], 'dep2', 'dep4');
      swap(match[i], 'score12', 'score34');
      var games = match[i].detail.split(',');
      for (var j = 0; j < games.length; j++) {
        games[j] = games[j].split('-').reverse().join('-');
      }
      match[i].detail = games.join(',');
    }
    if (superId == match[i].superId2) {
      swap(match[i], 'id1', 'id2');
      swap(match[i], 'superId1', 'superId2');
      swap(match[i], 'dep1', 'dep2');
    }
  }
  return;
};

exports.getTeam = function (superId, callback) {
  conn().query('select teamMatch.year, type, teamId, teamId as totalP, leftP, rightP,\
                matchId, matchType,\
                teamUser.name as name, dep0.name as dep,\
                team1.name as id1,\
                team2.name as id2,\
                team3.name as id3,\
                team4.name as id4,\
                team1.superId as superId1,\
                team2.superId as superId2,\
                team3.superId as superId3,\
                team4.superId as superId4,\
                dep1.name as dep12,\
                dep2.name as dep34,\
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
                order by year desc, type desc, abs(rightP - leftP) desc, leftP asc, rightP asc',
                [superId], function(err, teamMatch) {
    if (err) throw err;
    handle(teamMatch, superId);
    return callback(teamMatch);
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
    if (err) throw err;
    handle(indMatch, superId);
    return callback(indMatch);
  });
};

