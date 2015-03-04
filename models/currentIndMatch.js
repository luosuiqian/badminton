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
                WHERE referee = ? ORDER BY c.status',
               [studentid], function(err, results) {
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

exports.adminUsersGet = function (year, callback) {
  conn().query('SELECT type, total, id, name\
                FROM indUser WHERE year = ?',
                [year], function(err, users) {
    if (err) throw err;
    return callback(users);
  });
};

exports.adminMatchesGet = function (year, callback) {
  conn().query('SELECT year, type, totalP, leftP, rightP, points, space,\
                id1, id2, id3, id4,\
                game, total, diff, upper, pos, pos12,\
                pos34, serve, status, referee, name\
                FROM currentIndMatch\
                left join user on referee = studentid\
                WHERE year = ? ORDER BY status, space',
               [year], function(err, matches) {
    if (err) throw err;
    return callback(matches);
  });
};

exports.adminRefereesGet = function (callback) {
  conn().query('SELECT referee.studentid, referee.status, work, u.name\
                FROM referee left join\
                (select count(*) as work, referee\
                  from currentIndMatch where status <= 1 group by referee)\
                as c on referee.studentid = c.referee\
                left join user as u on referee.studentid = u.studentid\
                ORDER BY studentid',
                function(err, referees) {
    if (err) throw err;
    for (var i = 0; i < referees.length; i++) {
      if (referees[i].work == null) referees[i].work = 0;
    }
    return callback(referees);
  });
};

exports.adminPost = function (match, type, callback) {
  if (type == 1) {
    conn().query('INSERT INTO currentIndMatch SET ?', match, function(err) {
      if (err) throw err;
      return callback();
    });
  } else if (type == 2) {
    conn().query('INSERT INTO indMatch SET ?', match, function(err) {
      if (err) throw err;
      conn().query('UPDATE currentIndMatch SET status = 3 WHERE referee = ?\
                    and year = ? and type = ? and leftP = ? and rightP = ?',
                    [match.referee, match.year, match.type,
                    match.leftP, match.rightP], function(err) {
        if (err) throw err;
        return callback();
      });
    });
  } else if (type == 3) {
    conn().query('DELETE from currentIndMatch WHERE status = 0 and referee = ?\
                  and year = ? and type = ? and leftP = ? and rightP = ?',
                  [match.referee, match.year, match.type,
                  match.leftP, match.rightP], function(err) {
      if (err) throw err;
      return callback();
    });
  }
};

