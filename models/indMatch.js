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
    referee INT,
    points CHAR(200),
    pos12 INT,
    pos34 INT,
    serve INT,
    game INT,
    total INT,
    diff INT,
    upper INT,
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
  conn().query('SELECT leftP, rightP, id1, id2, id3, id4, \
                score12, score34, detail, referee FROM indMatch \
                WHERE year = ? and type = ?',
               [year, type], function(err, indMatch) {
    if (err) throw err;
    conn().query('SELECT total, id, name, superId FROM indUser WHERE year = ? and type = ?',
               [year, type], function(err, indUser) {
      if (err) throw err;
      var total = indUser[0].total;
      var name = new Array(total * 2 + 1);
      var superId = new Array(total * 2 + 1);
      for (var i = 0; i < indUser.length; i++) {
        name[indUser[i].id] = indUser[i].name;
        superId[indUser[i].id] = indUser[i].superId;
      }
      var pos = getPosition(total, 1, total);
      var table = new Array(total + 1);
      for (var i = 0; i < table.length; i++) {
        table[i] = new Array(pos.col + 1);
        for (var j = 0; j < table[i].length; j++) {
          table[i][j] = {height:0};
        }
      }
      for (var i = 1; i < table[0].length; i++) {
        table[0][i].height = 1;
        if (i == table[0].length - 1) table[0][i].content = '决赛/三四名';
        else if (i == table[0].length - 2) table[0][i].content = '半决赛';
        else table[0][i].content = '第' + i + '轮';
      }
      for (var i = 1; i < table.length; i++) {
        table[i][0].height = 1;
        if (type == 1) {
          table[i][0].id1 = name[i];
          table[i][0].superId1 = superId[i];
        } else {
          table[i][0].id1 = name[i * 2 - 1];
          table[i][0].superId1 = superId[i * 2 - 1];
          table[i][0].id2 = name[i * 2];
          table[i][0].superId2 = superId[i * 2];
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
        var tmp = table[pos.row][pos.col];
        tmp.id1 = name[indMatch[i].id1];
        tmp.superId1 = superId[indMatch[i].id1];
        tmp.id3 = name[indMatch[i].id3];
        tmp.superId3 = superId[indMatch[i].id3];
        if (type >= 3) {
          tmp.id2 = name[indMatch[i].id2];
          tmp.superId2 = superId[indMatch[i].id2];
          tmp.id4 = name[indMatch[i].id4];
          tmp.superId4 = superId[indMatch[i].id4];
        }
        tmp.score = indMatch[i].score12 + '-' + indMatch[i].score34;
        tmp.leftP = indMatch[i].leftP;
        tmp.rightP = indMatch[i].rightP;
        tmp.detail = indMatch[i].detail;
        tmp.referee = indMatch[i].referee;
      }
      return callback(table);
    });
  });
};

exports.getOneMatch = function (year, type, leftP, rightP, callback) {
  conn().query('SELECT u1.name as id1, u2.name as id2, u3.name as id3, u4.name as id4, \
                score12, score34, detail, points, pos12, pos34, \
                serve, game, i.total, diff, upper, user.name, dep.name as dep \
                FROM indMatch as i \
                left join indUser as u1 on u1.year = i.year and u1.type = i.type and u1.id = id1 \
                left join indUser as u2 on u2.year = i.year and u2.type = i.type and u2.id = id2 \
                left join indUser as u3 on u3.year = i.year and u3.type = i.type and u3.id = id3 \
                left join indUser as u4 on u4.year = i.year and u4.type = i.type and u4.id = id4 \
                left join user on user.studentid = i.referee \
                left join department as dep on user.departmentid = dep.id \
                WHERE i.year = ? and i.type = ? and leftP = ? and rightP = ?',
               [year, type, leftP, rightP], function(err, results) {
    if (err) throw err;
    if (results.length == 0) {
      return callback(null);
    } else {
      return callback(results[0]);
    }
  });
};

