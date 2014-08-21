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

var conn = require('./db').getConnection;

exports.get = function (year, type, callback) {
  conn().query('select teamId, leftP, rightP, dep12, dep34, total12, total34, \
                matchId, matchType, id1, id2, id3, id4, score12, score34, detail \
                from teamMatch where year = ? and type = ?',
                [year, type], function(err, results) {
    return callback(err, results);
  });
};

