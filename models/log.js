/*
create table if not exists log
(
    id INT auto_increment,
    date datetime,
    ip VARCHAR(50),
    url VARCHAR(200),
    method VARCHAR(10),
    user INT,
    primary key(id)
) character set utf8;
*/

var conn = require('./db').getConnection;

exports.log = function (ip, url, method, user) {
  if (url.length > 190) {
    url = url.substring(0, 190);
  }
  conn().query('insert into log values (null, ?, "?", "?", "?", ?)',
               [new Date(), ip, url, method, user], function(err) {
    if (err) throw err;
    return;
  });
};

