/*
create table if not exists log
(
    id INT auto_increment,
    date datetime,
    host VARCHAR(20),
    url VARCHAR(200),
    method VARCHAR(10),
    user INT,
    primary key(id)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.log = function (host, url, method, user) {
  conn().query('insert into log values (null, ?, "?", "?", "?", ?)',
               [new Date(), host, url, method, user], function(err) {
    if (err) {
      throw err;
    }
    return;
  });
};

