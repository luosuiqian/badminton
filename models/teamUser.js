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
  conn().query('select teamUser.id, teamUser.name, superId, department.name as dep \
                from teamUser, department where year = ? and dep = department.id',
                [year], function(err, results) {
    if (err) throw err;
    var maxDepartmentid = 0;
    for (var i = 0; i < results.length; i++) {
      var id = parseInt(results[i].id / 100);
      if (id > maxDepartmentid) {
        maxDepartmentid = id;
      }
    }
    var table = new Array(maxDepartmentid * 2);
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
    return callback(table);
  });
};

exports.getAll = function (year, type, callback) {
  var query;
  if (type == 1) {
    query = "select teamAuth.stu as studentid, teamAuth.name, \
            CASE WHEN sex = 'm' THEN '男' WHEN sex = 'f' THEN '女' ELSE '未知' END AS sex,\
            department.name as department, user.email, user.phone \
            from teamAuth \
            left join department on teamAuth.dep = department.id \
            left join user on teamAuth.stu = user.studentid \
            where teamAuth.year = ? and teamAuth.type = 0 \
            order by teamAuth.dep";
  } else if (type == 2) {
    query = "select stu as studentid, nam as name, '未知' AS sex,\
            department.name as department, ema as email, pho as phone \
            from teamApply, department where teamApply.year = ? \
            and teamApply.id = 31 and teamApply.dep = department.id \
            order by teamApply.dep";
  } else if (type == 3) {
    query = "select stu as studentid, nam as name, \
            CASE WHEN teamApply.id <= 20 THEN '男' ELSE '女' END AS sex,\
            department.name as department, ema as email, pho as phone \
            from teamApply, department where teamApply.year = ? \
            and teamApply.id <= 30 and teamApply.dep = department.id \
            order by teamApply.dep, teamApply.id";
  }
  conn().query(query, [year], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

