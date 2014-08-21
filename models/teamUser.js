/*
create table if not exists teamUser
(
    year INT,
    id INT,
    name VARCHAR(20),
    dep INT,
    superId INT,
    primary key(year, id)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.get = function (year, callback) {
  conn().query('select teamUser.id, teamUser.name, department.name as dep \
                from teamUser, department where year = ? and dep = department.id',
                [year], function(err, results) {
    return callback(err, results);
  });
};

