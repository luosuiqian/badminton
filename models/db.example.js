var mysql = require('mysql');

var db_config = {
    host: '127.0.0.1',
    user: '****',
    password: '****',
    database: 'badminton',
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

function initialize() {
  var createUser = 'create table if not exists user\
(\
    studentid INT,\
    password VARCHAR(100),\
    name VARCHAR(20),\
    sex CHAR(1),\
    departmentid INT,\
    email VARCHAR(100),\
    phone VARCHAR(15),\
    renrenid VARCHAR(15),\
    primary key(studentid),\
    privilege INT\
) character set utf8;';
  
  var createDepartment = 'create table if not exists department\
(\
    id INT,\
    name VARCHAR(15),\
    primary key(id)\
) character set utf8;';
  
  var createApplication = 'create table if not exists application\
(\
    id INT,\
    time INT,\
    space INT,\
    studentid INT,\
    chosen INT,\
    primary key(id, time, space)\
) character set utf8;';
  
  var createActivity = 'create table if not exists activity\
(\
    id INT,\
    time INT,\
    space INT,\
    studentid INT,\
    primary key(id, time, space)\
) character set utf8;';
  
  var createAuthority = 'create table if not exists authority\
(\
    studentid INT,\
    rank INT,\
    primary key(studentid)\
) character set utf8;';
  
  var initDepartment = 'insert ignore into department values\
(1,"电子工程系"),\
(2,"计算机科学与技术"),\
(3,"电机系"),\
(4,"土木建管系"),\
(5,"工程物理系"),\
(6,"化工系"),\
(7,"自动化系"),\
(8,"机械系"),\
(9,"建筑学院"),\
(10,"经济管理学院"),\
(11,"生命科学学院"),\
(12,"航天航空学院"),\
(13,"美术学院"),\
(14,"材料学院"),\
(15,"水利系"),\
(16,"环境学院"),\
(17,"热能工程系"),\
(18,"汽车系"),\
(19,"教育研究院"),\
(20,"物理系"),\
(21,"人文学院"),\
(22,"新闻与传播学院"),\
(23,"软件学院"),\
(24,"数学科学系"),\
(25,"化学系"),\
(26,"法学院"),\
(27,"医学院"),\
(28,"核能与新能源技术研究院"),\
(29,"公共管理学院"),\
(30,"微纳电子系"),\
(31,"协和医学院"),\
(32,"交叉信息研究院"),\
(33,"精密仪器系"),\
(34,"五道口金融学院"),\
(35,"社科学院"),\
(36,"工业工程");';
  
  connection.query(createUser, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("create user table successfully");
    }
  });
  connection.query(createDepartment, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("create department table successfully");
    }
  });
  connection.query(createApplication, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("create application table successfully");
    }
  });
  connection.query(createActivity, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("create activity table successfully");
    }
  });
  connection.query(createAuthority, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("create authority table successfully");
    }
  });
  connection.query(initDepartment, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("initialize department table successfully");
    }
  });
}

//initialize();

module.exports = function getConnection() {
  return connection;
};

