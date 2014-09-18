var conn = require('./db').getConnection;

exports.getAll = function (numberL, numberR, callback) {
  conn().query("select user.studentid,user.name,\
                CASE WHEN sex = 'm' THEN '男' ELSE '女' END AS sex,\
                department.name as department,email,phone,prikey,money\
                from user,department,authority\
                where user.departmentid = department.id\
                and user.studentid = authority.studentid\
                and user.studentid > 1000000010\
                and ? <= authority.rank and authority.rank <= ?\
                order by sex desc, user.studentid",
              [numberL, numberR], function(err, results) {
    return callback(err, results);
  });
};

exports.getAllNoAuthority = function (callback) {
  conn().query("select user.studentid,user.name,\
                CASE WHEN sex = 'm' THEN '男' ELSE '女' END AS sex,\
                department.name as department,email,phone\
                from user,department\
                where user.departmentid = department.id\
                and user.studentid > 1000000010\
                and user.studentid NOT IN (SELECT studentid FROM authority)\
                order by user.sex desc, user.studentid",
              function(err, results) {
    return callback(err, results);
  });
};

