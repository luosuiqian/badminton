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

exports.refGetAll = function (callback) {
  conn().query('SELECT studentid, status FROM referee',
               function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

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
  conn().query('SELECT * FROM currentIndMatch WHERE referee = ?',
               [studentid], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

exports.matchGet = function (studentid, year, type, leftP, rightP, callback) {
  conn().query('SELECT * FROM currentIndMatch WHERE referee = ?\
                and year = ? and type = ? and leftP = ? and rightP = ?',
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
  conn().query('UPDATE currentIndMatch SET ? WHERE referee = ?\
                and year = ? and type = ? and leftP = ? and rightP = ?',
               [match, match.referee, match.year, match.type,
                match.leftP, match.rightP], function(err) {
    if (err) {
      console.log(err);
    }
    return callback();
  });
};

exports.adminGet = function (callback) {
  conn().query('SELECT * FROM currentIndMatch',
               function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

var IndMatch = function (match) {
  this.year = match.year;
  // TODO
};

exports.adminPost = function (match, type, callback) {
  if (type == 1) {
    conn().query('INSERT INTO currentIndMatch SET ?', match, function(err) {
      if (err) throw err;
      return callback();
    });
  } else if (type == 2) {
    var indMatch = new IndMatch(match);
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

