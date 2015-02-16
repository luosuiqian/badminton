var conn = require('./db').getConnection;
var Global = require('./global');

exports.getAll = function (numberL, numberR, callback) {
  var dayid = Global.getDayid();
  conn().query("select user.studentid,user.name,\
                CASE WHEN sex = 'm' THEN '男' ELSE '女' END AS sex,\
                department.name as department,email,phone,prikey,money,sign.dayid\
                from authority,department,user \
                LEFT JOIN sign on user.studentid = sign.studentid and sign.dayid = ? \
                where user.departmentid = department.id\
                and user.studentid = authority.studentid\
                and ? <= authority.rank and authority.rank <= ?\
                order by sex desc, user.studentid",
              [dayid, numberL, numberR], function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

exports.getAllNoAuthority = function (callback) {
  conn().query("select user.studentid,user.name,\
                CASE WHEN sex = 'm' THEN '男' ELSE '女' END AS sex,\
                department.name as department,email,phone\
                from user,department\
                where user.departmentid = department.id\
                and user.studentid NOT IN (SELECT studentid FROM authority)\
                order by user.sex desc, user.studentid",
              function(err, results) {
    if (err) throw err;
    return callback(results);
  });
};

