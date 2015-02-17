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

exports.getMatchAll = function (studentid, callback) {
  conn().query('SELECT * FROM currentIndMatch WHERE referee = ?',
               [studentid], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

exports.getMatch = function (studentid, year, type, leftP, rightP, callback) {
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

exports.updateMatch = function (match, callback) {
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

exports.adminPost = function (newMatch, callback) {
  conn().query('INSERT INTO currentIndMatch SET ?', newMatch, function(err) {
    if (err) throw err;
    return callback();
  });
};

