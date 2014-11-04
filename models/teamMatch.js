/*
create table if not exists teamMatch
(
    year INT,
    type INT,
    teamId INT,
    leftP INT,
    rightP INT,
    dep12 INT,
    dep34 INT,
    total12 INT,
    total34 INT,
    matchId INT,
    matchType INT,
    id1 INT,
    id2 INT,
    id3 INT,
    id4 INT,
    score12 INT,
    score34 INT,
    detail VARCHAR(20),
    primary key(year, type, teamId, leftP, rightP, matchId)
) character set utf8;

create table if not exists teamOutline
(
    year INT,
    type INT,
    teamId INT,
    total INT,
    num INT,
    dep INT,
    rank VARCHAR(3),
    primary key(year, type, teamId, num)
) character set utf8;
*/

var util = require('util');
var conn = require('./db').getConnection;

var getPosition = function (total, leftP, rightP) {
  var dis = rightP - leftP + 1;
  if (leftP > rightP) {
    dis = leftP - rightP + 1;
  }
  var col = 0;
  while (dis > 1) {
    dis = parseInt(dis / 2);
    col += 1;
  }
  var row = leftP;
  if (leftP > rightP) {
    row = parseInt((leftP + rightP) / 2 + 1);
  }
  return {'row':row, 'col':col};
};

exports.get = function (year, type, callback) {
  conn().query('select teamId, total, num, dep, name, rank \
                from teamOutline, department where year = ? and type = ? and dep = id',
                [year, type], function(err, outline) {
    if (err) {
      return callback(err, null);
    }
    conn().query('select distinct teamId, leftP, rightP, dep12, dep34, total12, total34 \
                  from teamMatch where year = ? and type = ?',
                  [year, type], function(err, results) {
      if (err) {
        return callback(err, null);
      }
      if (type <= 2) {
        var teamNum = 0;
        for (var i = 0; i < outline.length; i++) {
          if (outline[i].teamId > teamNum) {
            teamNum = outline[i].teamId;
          }
        }
        var tables = new Array(teamNum);
        var depName = {};
        for (var i = 0; i < outline.length; i++) {
          var id = outline[i].teamId - 1;
          if (tables[id] == null) {
            tables[id] = new Array(outline[i].total + 1);
            for (var j = 0; j < tables[id].length; j++) {
              tables[id][j] = new Array(outline[i].total + 2);
            }
            tables[id][0][0] = '比分';
            tables[id][0][outline[i].total + 1] = '排名';
            for (var j = 1; j <= outline[i].total; j++) {
              tables[id][j][j] = '-';
            }
          }
          tables[id][outline[i].num][outline[i].total + 1] = outline[i].rank;
          tables[id][outline[i].num][0] = outline[i].name;
          tables[id][0][outline[i].num] = outline[i].name;
          depName[outline[i].dep] = outline[i].name;
        }
        for (var i = 0; i < results.length; i++) {
          var id = results[i].teamId - 1;
          if (tables[id][results[i].leftP][0] != depName[results[i].dep12]) {
            callback('DB content error!', null);
          }
          if (tables[id][results[i].rightP][0] != depName[results[i].dep34]) {
            callback('DB content error!', null);
          }
          tables[id][results[i].leftP][results[i].rightP] = results[i].total12 + ':' + results[i].total34;
          tables[id][results[i].rightP][results[i].leftP] = results[i].total34 + ':' + results[i].total12;
        }
        return callback(err, tables);
      } else {
        var total = outline[0].total;
        var pos = getPosition(total, 1, total);
        var table = new Array(total + 1);
        for (var i = 0; i < table.length; i++) {
          table[i] = new Array(pos.col + 1);
          for (var j = 0; j < table[i].length; j++) {
            table[i][j] = {height:0, content:''};
          }
        }
        table[0][0] = {height:1, content:'比分'};
        for (var i = 1; i < table[0].length; i++) {
          table[0][i].height = 1;
          if (i == table[0].length - 1) {
            if (table[0].length == 2) {
              table[0][i].content = '决赛';
            } else {
              table[0][i].content = '决赛/三四名';
            }
          } else if (i == table[0].length - 2) {
            table[0][i].content = '半决赛';
          } else {
            table[0][i].content = '第' + i + '轮';
          }
        }
        var depName = {};
        for (var i = 0; i < outline.length; i++) {
          table[outline[i].num][0].height = 1;
          table[outline[i].num][0].content = outline[i].name;
          depName[outline[i].dep] = outline[i].name;
        }
        var height = 1;
        for (var c = 1; c < table[0].length; c++) {
          if (c != table[0].length - 1 || table[0].length == 2) {
            height = height * 2;
          }
          for (var i = 1; i < table.length; i += height) {
            table[i][c].height = height;
          }
        }
        for (var i = 0; i < results.length; i++) {
          var pos = getPosition(total, results[i].leftP, results[i].rightP);
          var str = util.format("%s %d:%d %s",
                              depName[results[i].dep12],
                              results[i].total12,
                              results[i].total34,
                              depName[results[i].dep34]);
          table[pos.row][pos.col].content = str;
        }
        return callback(err, [table]);
      }
    });
  });
};

exports.getDetails = function (year, type, teamId, left, right, callback) {
  conn().query('select dep1.name as dep12, dep2.name as dep34,\
                total12, total34, matchId, matchType, \
                team1.name as id1,\
                team2.name as id2,\
                team3.name as id3,\
                team4.name as id4,\
                team1.superId as superId1,\
                team2.superId as superId2,\
                team3.superId as superId3,\
                team4.superId as superId4,\
                score12, score34, detail from teamMatch \
                left join teamUser as team1 on id1 = team1.id and team1.year = ? \
                left join teamUser as team2 on id2 = team2.id and team2.year = ? \
                left join teamUser as team3 on id3 = team3.id and team3.year = ? \
                left join teamUser as team4 on id4 = team4.id and team4.year = ? \
                left join department as dep1 on dep12 = dep1.id \
                left join department as dep2 on dep34 = dep2.id \
                where teamMatch.year = ? and type = ? and teamId = ? and leftP = ? and rightP = ? \
                order by matchId',
                [year, year, year, year, year, type, teamId, left, right], function(err, results) {
    if (err) {
      return callback(err, null);
    }
    if (results.length == 0) {
      return callback('URL错误', null);
    }
    callback(null, results);
  });
};

