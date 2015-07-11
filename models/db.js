var mysql = require('mysql');

var db_config = {
  host: '101.6.97.122',
  user: 'iiis',
  password: 'helloworld',
  database: 'badminton',
};

var connection;

var handleDisconnect = function () {
  connection = mysql.createConnection(db_config);
  connection.connect(function (err) {
    if(err) {
      throw err;
    }
  });
  connection.on('error', function (err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
};

handleDisconnect();

exports.getConnection = function () {
  return connection;
};

exports.getStore = function () {
  var SessionStore = require('express-mysql-session');
  return new SessionStore(db_config);
};

