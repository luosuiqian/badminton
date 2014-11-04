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

var Global = require('./global');
var conn = require('./db').getConnection;

exports.get = function (year, callback) {
  conn().query('select teamUser.id, teamUser.name, superId, department.name as dep \
                from teamUser, department where year = ? and dep = department.id',
                [year], function(err, results) {
    var table = new Array(Global.maxDepartmentid * 2);
    for (var i = 0; i < table.length; i += 2) {
      table[i] = new Array(9);
      table[i + 1] = new Array(9);
      table[i][0] = {height:2, content: i / 2 + 1};
      table[i + 1][0] = {height:0, content: ''};
      table[i][1] = {height:2, content: ''};
      table[i + 1][1] = {height:0, content: ''};
      table[i][2] = {height:1, content: '男'};
      table[i + 1][2] = {height:1, content: '女'};
      for (var j = 3; j < 9; j++) {
        table[i][j] = {height:1, content: '（空）'};
        table[i + 1][j] = {height:1, content: '（空）'};
      }
    }
    for (var i = 0; i < results.length; i++) {
      var row = (parseInt(results[i].id / 100) - 1) * 2;
      table[row][1].content = results[i].dep;
      if (results[i].id % 100 > 20) {
        row++;
      }
      var col = results[i].id % 10 + 2;
      table[row][col].content = results[i].name;
      table[row][col].superId = results[i].superId;
    }
    return callback(err, table);
  });
};

