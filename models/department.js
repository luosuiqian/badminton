/*
create table if not exists department
(
    id INT,
    name VARCHAR(15),
    primary key(id)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.getAll = function (callback) {
  conn().query('SELECT id, name FROM department', function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

