/*
create table if not exists currentIndMatch
(
    year INT,
    type INT,
    totalP INT,
    leftP INT,
    rightP INT,
    id1 INT,
    id2 INT,
    id3 INT,
    id4 INT,
    points CHAR(200),
    game INT,
    total INT,
    diff INT,
    upper INT,
    pos INT,
    pos12 INT,
    pos34 INT,
    serve INT,
    status INT,
    referee INT,
    space INT,
    primary key(year, type, leftP, rightP)
) character set utf8;

create table if not exists referee
(
    studentid INT,
    status INT,
    primary key(studentid)
) character set utf8;

create table if not exists indUser
(
    year INT,
    type INT,
    id INT,
    name VARCHAR(20),
    dep INT,
    superId INT,
    primary key(year, type, id)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.refGet = function (studentid, callback) {
  conn().query('SELECT studentid, status FROM referee WHERE studentid = ?',
               [studentid], function(err, results) {
    if (err) throw err;
    if (results.length == 0) {
      return callback(null);
    } else {
      return callback(results[0]);
    }
  });
};

exports.refOn = function (studentid, callback) {
  conn().query('UPDATE referee SET status = 1 WHERE studentid = ?',
               [studentid], function(err) {
    if (err) throw err;
    return callback();
  });
};

exports.refOff = function (studentid, callback) {
  conn().query('UPDATE referee SET status = 0 WHERE studentid = ?',
               [studentid], function(err) {
    if (err) throw err;
    return callback();
  });
};

exports.matchGetAll = function (studentid, callback) {
  conn().query('SELECT c.year, c.type, c.leftP, c.rightP, c.status, c.space,\
                ind1.name as id1,\
                ind2.name as id2,\
                ind3.name as id3,\
                ind4.name as id4\
                FROM currentIndMatch as c\
                left join indUser as ind1 on c.id1 = ind1.id and c.year = ind1.year and c.type = ind1.type \
                left join indUser as ind2 on c.id2 = ind2.id and c.year = ind2.year and c.type = ind2.type \
                left join indUser as ind3 on c.id3 = ind3.id and c.year = ind3.year and c.type = ind3.type \
                left join indUser as ind4 on c.id4 = ind4.id and c.year = ind4.year and c.type = ind4.type \
                WHERE referee = ?', [studentid], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

exports.matchGet = function (studentid, year, type, leftP, rightP, callback) {
  conn().query('SELECT c.year, c.type, c.leftP, c.rightP, c.points,\
                ind1.name as id1,\
                ind2.name as id2,\
                ind3.name as id3,\
                ind4.name as id4,\
                c.game, c.total, c.diff, c.upper, c.pos, c.pos12,\
                c.pos34, c.serve, c.status, c.referee\
                FROM currentIndMatch as c\
                left join indUser as ind1 on c.id1 = ind1.id and c.year = ind1.year and c.type = ind1.type \
                left join indUser as ind2 on c.id2 = ind2.id and c.year = ind2.year and c.type = ind2.type \
                left join indUser as ind3 on c.id3 = ind3.id and c.year = ind3.year and c.type = ind3.type \
                left join indUser as ind4 on c.id4 = ind4.id and c.year = ind4.year and c.type = ind4.type \
                WHERE c.referee = ?\
                and c.year = ? and c.type = ? and c.leftP = ? and c.rightP = ?',
               [studentid, year, type, leftP, rightP], function(err, results) {
    if (err) throw err;
    if (results.length == 0) {
      return callback(null);
    } else {
      return callback(results[0]);
    }
  });
};

exports.matchUpdate = function (match, callback) {
  conn().query('UPDATE currentIndMatch SET points = ?, pos = ?, pos12 = ?,\
                pos34 = ?, serve = ?, status = ? WHERE referee = ?\
                and year = ? and type = ? and leftP = ? and rightP = ?',
               [match.points, match.pos, match.pos12, match.pos34,
                match.serve, match.status, match.referee, match.year,
                match.type, match.leftP, match.rightP], function(err) {
    if (err) {
      console.log(err);
    }
    return callback();
  });
};

var parse = function(match) {
  var totalGame = parseInt(match.game);
  var scoreL = new Array(totalGame * 2 - 1);
  var scoreR = new Array(totalGame * 2 - 1);
  for (var i = 0; i < totalGame * 2 - 1; i++) scoreL[i] = scoreR[i] = 0;
  var gameL = 0, gameR = 0, now = 0, swap = false, giveUp = false;
  var finished = false, newGame = true, finalPos = false;
  var pos = match.pos, serve = match.serve;
  var posL = match.pos12 & 1;
  var posR = match.pos34 & 1;
  for (var i = 0; i < match.points.length; i++) {
    swap = false;
    if (match.points[i] == '8' || match.points[i] == '9') {
      if (match.points[i] == '8') gameR = totalGame;
      if (match.points[i] == '9') gameL = totalGame;
      giveUp = true;
      finished = true;
      newGame = false;
      break;
    }
    if (match.points[i] == '0') {
      scoreL[now]++;
      if (serve == 0) posL = 1 - posL;
      else serve = 0;
    }
    if (match.points[i] == '1') {
      scoreR[now]++;
      if (serve == 1) posR = 1 - posR;
      else serve = 1;
    }
    if (now == totalGame && (scoreL[now] == parseInt((match.total + 1) / 2)
        || scoreR[now] == parseInt((match.total + 1) / 2)) && !finalPos) {
      finalPos = true;
      pos = 1 - pos;
      swap = true;
    }
    if (((scoreL[now] >= match.total || scoreR[now] >= match.total)
        && (scoreL[now] - scoreR[now] >= match.diff
            || scoreR[now] - scoreL[now] >= match.diff))
        || scoreL[now] == match.upper || scoreR[now] == match.upper) {
      if (scoreL[now] > scoreR[now]) gameL++;
      if (scoreL[now] < scoreR[now]) gameR++;
      if (gameL == totalGame || gameR == totalGame) {
        finished = true;
        newGame = false;
        break;
      } else {
        finished = false;
        newGame = true;
        now++;
        pos = 1 - pos;
        swap = true;
        posL = (match.pos12 >> now) & 1;
        posR = (match.pos34 >> now) & 1;
      }
    } else {
      finished = false;
      newGame = false;
    }
  }
  var points = '';
  for (var i = 0; i <= now; i++) {
    if (i > 0) points += ',';
    if (scoreL[i] > 0 || scoreR[i] > 0) points += scoreL[i] + "-" + scoreR[i];
  }
  if (giveUp) {
    if (points != '') points += ',';
    points += "弃";
  }
  return {gameL: gameL, gameR: gameR, giveUp: giveUp,
      scoreL: scoreL, scoreR: scoreR, points: points, swap: swap,
      now: now, newGame: newGame, finished: finished,
      pos: pos, posL: posL, posR: posR, serve: serve};
}

var getReadyMatch = function (year, users, current) {
  var ready = [];
  var types = [1, 3, 4, 5];
  var total = [null, 0, null, 0, 0, 0];
  var user = [null, {}, null, {}, {}, {}];
  for (var i = 0; i < users.length; i++) {
    total[users[i].type] = users[i].total;
    user[users[i].type][users[i].id] = users[i].name;
  }
  for (var t in types) {
    var type = types[t];
    var result = new Array(total[type]);
    for (var i = 0; i < total[type]; i++) result[i] = 0;
    for (var i = 1; i < total[type]; i += 2) {
      if (type == 1) var idR = i + 1;
      else var idR = i * 2 + 1;
      if (user[type][idR] == null) result[i] = i;
    }
    for (var i = 0; i < current.length; i++) {
      if (current[i].type == type) {
        if (current[i].status >= 2) {
          var detail = parse(current[i]);
          if (detail.gameL > detail.gameR) var winner = current[i].id1;
          if (detail.gameL < detail.gameR) var winner = current[i].id3;
          result[parseInt((current[i].leftP + current[i].rightP) / 2)] = winner;
        } else {
          result[parseInt((current[i].leftP + current[i].rightP) / 2)] = -1;
        }
        current[i].id1 = user[type][current[i].id1];
        current[i].id2 = user[type][current[i].id2];
        current[i].id3 = user[type][current[i].id3];
        current[i].id4 = user[type][current[i].id4];
      }
    }
    for (var i = 1; i < total[type]; i += 2) {
      if (result[i] == 0) {
        ready.push({year: year, type: type, totalP: total[type],
            leftP: i, rightP: i + 1,
            id1: type==1?  i:i*2-1,
            id2: type==1?  0:  i*2,
            id3: type==1?i+1:i*2+1,
            id4: type==1?  0:i*2+2,
        });
      }
    }
    for (var i = 2; i < total[type]; i += 2) {
      if (result[i] == 0) {
        var idL =  i - (i - (i & (i - 1)) >> 1);
        var idR =  i + (i - (i & (i - 1)) >> 1);
        if (result[idL] > 0 && result[idR] > 0) {
          ready.push({year: year, type: type, totalP: total[type],
              leftP: (i & (i - 1)) + 1, rightP: i + (i - (i & (i - 1))),
              id1: type==1?result[idL]:result[idL]*2-1,
              id2: type==1?          0:result[idL]*2,
              id3: type==1?result[idR]:result[idR]*2-1,
              id4: type==1?          0:result[idR]*2,
          });
        }
      }
    }
  }
  return ready;
};

exports.adminGet = function (year, callback) {
  conn().query('SELECT year, type, totalP, leftP, rightP, points, space,\
                id1, id2, id3, id4,\
                game, total, diff, upper, pos, pos12,\
                pos34, serve, status, referee\
                FROM currentIndMatch\
                WHERE year = ?',
               [year], function(err, current) {
    if (err) throw err;
    conn().query('SELECT studentid, referee.status, work\
                  FROM referee left join\
                  (select count(*) as work, referee\
                    from currentIndMatch where status <= 1 group by referee)\
                  as c on studentid = c.referee',
                 function(err, referees) {
      if (err) throw err;
      conn().query('SELECT type, total, id, name\
                    FROM indUser WHERE year = ?',
                   [year], function(err, users) {
        if (err) throw err;
        var ready = getReadyMatch(year, users, current);
        return callback(ready, current, referees);
      });
    });
  });
};

var IndMatch = function (match) {
  var detail = parse(match);
  this.year = match.year;
  this.type = match.type;
  this.totalP = match.totalP;
  this.leftP = match.leftP;
  this.rightP = match.rightP;
  this.id1 = match.id1;
  this.id2 = match.id2;
  this.id3 = match.id3;
  this.id4 = match.id4;
  this.score12 = detail.gameL;
  this.score34 = detail.gameR;
  this.detail = detail.points;
  this.referee = match.referee;
  this.points = match.points;
  this.pos12 = match.pos12;
  this.pos34 = match.pos34;
  this.serve = match.serve;
};

exports.adminPost = function (match, type, callback) {
  if (type == 1) {
    conn().query('INSERT INTO currentIndMatch SET ?', match, function(err) {
      if (err) throw err;
      return callback();
    });
  } else if (type == 2) {
    conn().query('SELECT year, type, leftP, rightP, points,\
                  id1, id2, id3, id4,\
                  game, total, diff, upper, pos, pos12,\
                  pos34, serve, status, referee\
                  FROM currentIndMatch WHERE referee = ?\
                  and year = ? and type = ? and leftP = ? and rightP = ?',
                 [match.referee, match.year, match.type,
                  match.leftP, match.rightP], function(err, m) {
      if (err) throw err;
      var indMatch = new IndMatch(m);
      conn().query('INSERT INTO indMatch SET ?', indMatch, function(err) {
        if (err) throw err;
        conn().query('UPDATE currentIndMatch SET status = 3 WHERE referee = ?\
                      and year = ? and type = ? and leftP = ? and rightP = ?',
                     [match.referee, match.year, match.type,
                      match.leftP, match.rightP], function(err) {
          if (err) throw err;
          return callback();
        });
      });
    });
  } else if (type == 3) {
    conn().query('delete from currentIndMatch WHERE referee = ?\
                  and year = ? and type = ? and leftP = ? and rightP = ?',
                 [match.referee, match.year, match.type,
                  match.leftP, match.rightP], function(err) {
      if (err) throw err;
      return callback();
    });
  }
};

