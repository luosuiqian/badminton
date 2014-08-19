var conn = require('./db').getConnection;

exports.getAll = function (callback) {
  conn().query('SELECT id, name FROM department', function(err, results) {
    if (err) {
      return callback(err, null);
    } else {
      return callback(null, results);
    }
  });
};

