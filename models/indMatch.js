/*
create table if not exists indMatch
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
    score12 INT,
    score34 INT,
    detail VARCHAR(20),
    primary key(year, type, leftP, rightP)
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
  conn().query('SELECT totalP, leftP, rightP, id1, id2, id3, id4, \
                score12, score34, detail FROM indMatch \
                WHERE year = ? and type = ?',
               [year, type], function(err, indMatch) {
    if (err) {
      return callback(err, null);
    }
    conn().query('SELECT id, name FROM indUser WHERE year = ? and type = ?',
               [year, type], function(err, indUser) {
      if (err) {
        return callback(err, null);
      }
      var total = indMatch[0].totalP;
      var name = new Array(total * 2 + 1);
      for (var i = 0; i < name.length; i++) {
        name[i] = '（空）';
      }
      for (var i = 0; i < indUser.length; i++) {
        name[indUser[i].id] = indUser[i].name;
      }
      var pos = getPosition(total, 1, total);
      var table = new Array(total + 1);
      for (var i = 0; i < table.length; i++) {
        table[i] = new Array(pos.col + 1);
        for (var j = 0; j < table[i].length; j++) {
          table[i][j] = {height:0, content:['（空）'], detail:''};
        }
      }
      for (var i = 1; i < table[0].length; i++) {
        if (i == table[0].length - 1) table[0][i].content = '决赛/三四名';
        else if (i == table[0].length - 2) table[0][i].content = '半决赛';
        else table[0][i].content = '第' + i + '轮';
      }
      for (var i = 1; i < table.length; i++) {
        table[i][0].height = 1;
        if (type == 1) {
          table[i][0].content = name[i];
        } else {
          table[i][0].content = util.format("%s/%s", name[i * 2 - 1], name[i * 2]);
        }
      }
      var height = 1;
      for (var c = 1; c < table[0].length; c++) {
        if (c != table[0].length - 1) {
          height = height * 2;
        }
        for (var i = 1; i < table.length; i += height) {
          table[i][c].height = height;
        }
      }
      for (var i = 0; i < indMatch.length; i++) {
        var pos = getPosition(total, indMatch[i].leftP, indMatch[i].rightP);
        var str;
        if (type == 1) {
          str = util.format("%s\t%d-%d\t%s",
                            name[indMatch[i].id1],
                            indMatch[i].score12,
                            indMatch[i].score34,
                            name[indMatch[i].id3]);
        } else {
          str = util.format("%s/%s\t%d-%d\t%s/%s",
                            name[indMatch[i].id1], name[indMatch[i].id2],
                            indMatch[i].score12,
                            indMatch[i].score34,
                            name[indMatch[i].id3], name[indMatch[i].id4]);
        }
        table[pos.row][pos.col].content = str.split('\t');
        table[pos.row][pos.col].detail = indMatch[i].detail;
      }
      return callback(null, table);
    });
  });
};

