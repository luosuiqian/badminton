/***********************************************

db error { [Error: Connection lost: The server closed the connection.]
  fatal: true, code: 'PROTOCOL_CONNECTION_LOST' }
The cause is 'Time out' setting.
Fixed

(node) warning: possible EventEmitter memory leak detected.
11 listeners added. Use emitter.setMaxListeners() to increase limit.
Trace
    at Socket.EventEmitter.addListener (events.js:160:15)
    at Socket.Readable.on (_stream_readable.js:653:33)
    at Socket.EventEmitter.once (events.js:179:8)
    at TCP.onread (net.js:527:26)
FATAL ERROR: CALL_AND_RETRY_2 Allocation failed - process out of memory
Upgrade node to version 0.11.11
Fixing...

//***********************************************

Use the following code to debug.
After upgrade node to version 0.11.11, the value of listenerCount
has never been greater 50 in a few days.
Keep on tracking...

var count = 0;
var events = require("events");
var EventEmitter = events.EventEmitter;
EventEmitter.prototype.setMaxListeners(50);
var originalAddListener = EventEmitter.prototype.addListener;
EventEmitter.prototype.addListener = function (type, listener) {
  if (EventEmitter.listenerCount(this, type) >= 50) {
    if (count == 0) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(this);
      console.log('***********************************************');
      console.log(type);
      console.log('===============================================');
    }
    count = count + 1;
    if (count % 10000 == 0) {
      console.log(count);
    }
    this.removeAllListeners(type);
  }
  return originalAddListener.apply(this, arguments);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

//***********************************************

This is the end for bug record.

//***********************************************/

var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var app = express();

var User = require('./models/user');
var Application = require('./models/application');
var Department = require('./models/department');
var Authority = require('./models/authority');
var Activity = require('./models/activity');
var List = require('./models/list');

// log
// var fs = require('fs');
// var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
// app.use(express.logger({stream: accessLogfile}));

app.set('port', 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.urlencoded())
app.use(express.json())
app.use(express.cookieParser());
app.use(express.session({secret: 'SXLlGmJfOZhCtzxtqp9T'}));
app.use(flash());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

function checkLogin(req, res, next) {
  if (req.session.user == null) {
    req.flash('warning', '请先登录');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user != null) {
    req.flash('warning', '请先登出');
    return res.redirect('/');
  }
  next();
}

//index
app.get('/', function(req, res) {
  res.render('index.jade', {
    name: 'index',
    user: req.session.user,
    flash: req.flash(),
  });
});

//application
app.get('/application', function(req, res) {
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/');
    }
    Application.getAll(function(err, table) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/');
      }
      Application.getStudentid(req.session.user, function(err, result) {
        if (err) {
          req.flash('warning', err);
          return res.redirect('/');
        }
        res.render('application.jade', {
          name: 'application',
          user: req.session.user,
          flash: req.flash(),
          open: Application.checkTime(),
          sex: (userinfo != null)?userinfo[0].sex:null,
          table: table,
          result: result,
        });
      });
    });
  });
});

app.post('/application', checkLogin);
app.post('/application', function(req, res) {
  if (Application.checkTime() == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/application');
  }
  if (req.body.type == 'delete') {
    Application.del(req.session.user, function(err) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/application');
      }
      req.flash('info', '取消报名成功');
      return res.redirect('/application');
    });
  } else if (req.body.type == 'post') {
    var time = parseInt(req.body.timespace / 100);
    var space = parseInt(req.body.timespace % 100);
    var application = new Application.Application(time, space, req.session.user);
    Application.save(application, function(err) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/application');
      } else {
        req.flash('info', '报名成功');
        return res.redirect('/application');
      }
    });
  }
});

//activity
function Request(activityInit) {
  var activity = activityInit;
  var ret = new Object();
  ret.get = function (req, res) {
    activity.getAuthority(req.session.user, function(err, authority) {
      if (err) {
        console.log(err);
        req.flash('warning', err);
        return res.redirect('/');
      }
      var checkTime = activity.checkTime();
      activity.getAll(function(err, table) {
        if (err) {
          console.log(err);
          req.flash('warning', err);
          return res.redirect('/');
        }
        activity.getStudentid(req.session.user, function(err, result) {
          if (err) {
            console.log(err);
            req.flash('warning', err);
            return res.redirect('/');
          }
          res.render('activity.jade', {
            name: 'activity',
            user: req.session.user,
            flash: req.flash(),
            open: checkTime,
            authority: authority,
            table: table,
            result: result,
            time: activity.getTime(),
          });
        });
      });
    });
  };
  ret.post = function(req, res) {
    if (activity.checkTime() == false) {
      req.flash('warning', '现在不是报名时间');
      return res.redirect('.');
    }
    activity.getAuthority(req.session.user, function(err, authority) {
      if (authority == false) {
        req.flash('warning', '抱歉，您不是会员，不能预约');
        return res.redirect('/');
      }
      if (req.body.type == 'delete') {
        activity.del(req.session.user, function(err) {
          if (err) {
            req.flash('warning', err);
            return res.redirect('.');
          }
          req.flash('info', '取消报名成功');
          return res.redirect('.');
        });
      } else if (req.body.type == 'post') {
        var time = parseInt(req.body.timespace / 100);
        var space = parseInt(req.body.timespace % 100);
        var oneActivity = new activity.Activity(time, space, req.session.user);
        activity.save(oneActivity, function(err) {
          if (err) {
            req.flash('warning', err);
            return res.redirect('.');
          } else {
            req.flash('info', '报名成功');
            return res.redirect('.');
          }
        });
      }
    });
  };
  return ret;
};

var crowdThursday = Request(
  Activity.Activity(6, 6, 'crowdThursday', 1, 1,
    new Date(2014,3-1,11,13,0,0), new Date(2014,3-1,13,15,0,0), '清华综体', [1,2,3,4,5,6]
  )
);
app.get('/crowdThursday', crowdThursday.get);
app.post('/crowdThursday', checkLogin);
app.post('/crowdThursday', crowdThursday.post);

var crowdFriday = Request(
  Activity.Activity(6, 3, 'crowdFriday', 1, 1,
    new Date(2014,3-1,12,13,0,0), new Date(2014,3-1,14,15,0,0), '清华综体', [3,4,5]
  )
);
app.get('/crowdFriday', crowdFriday.get);
app.post('/crowdFriday', checkLogin);
app.post('/crowdFriday', crowdFriday.post);

var activityFriday = Request(
  Activity.Activity(6, 3, 'activityFriday', 2, 3,
    new Date(2014,3-1,5,13,0,0), new Date(2014,3-1,7,15,0,0), '清华综体', [8,9,10]
  )
);
app.get('/activityFriday', activityFriday.get);
app.post('/activityFriday', checkLogin);
app.post('/activityFriday', activityFriday.post);

var activitySaturday = Request(
  Activity.Activity(6, 4, 'activitySaturday', 2, 3,
    new Date(2014,3-1,6,13,0,0), new Date(2014,3-1,8,22,0,0), '清华西体', [5,6,7,8]
  )
);
app.get('/activitySaturday', activitySaturday.get);
app.post('/activitySaturday', checkLogin);
app.post('/activitySaturday', activitySaturday.post);

//===========================================================================//

//register
app.get('/register', checkNotLogin);
app.get('/register', function(req, res) {
  Department.getAll(function(err, departments) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/');
    }
    res.render('register.jade', {
      name: 'register',
      user: req.session.user,
      flash: req.flash(),
      departments: departments,
    });
  });
});

app.post('/register', checkNotLogin);
app.post('/register', function(req, res) {
  if (req.body.password != req.body.repeatpassword) {
    req.flash('warning', '密码两次输入不一致，您可以用浏览器的后退功能重新填写表单');
    return res.redirect('/register');
  }
  var user = new User.User(
    req.body.studentid,
    req.body.password,
    req.body.name,
    req.body.sex,
    req.body.departmentid,
    req.body.email,
    req.body.phone,
    req.body.renrenid
  );
  User.save(user, function(err) {
    if (err) {
      req.flash('warning', err + '，您可以用浏览器的后退功能重新填写表单');
      return res.redirect('/register');
    } else {
      req.flash('info', '注册成功');
      return res.redirect('/login');
    }
  });
});

//edit
app.get('/edit', checkLogin);
app.get('/edit', function(req, res) {
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/');
    }
    Department.getAll(function(err, departments) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/');
      }
      res.render('edit.jade', {
        name: 'edit',
        user: req.session.user,
        flash: req.flash(),
        departments: departments,
        userinfo: userinfo[0],
      });
    });
  });
});

app.post('/edit', checkLogin);
app.post('/edit', function(req, res) {
  var studentid = req.session.user;
  var password = req.body.password;
  User.get(studentid, function(err, userinfo) {
    if (userinfo[0].password != password) {
      req.flash('warning', '密码错误');
      return res.redirect('/edit');
    }
    if (req.body.newpassword != req.body.repeatpassword) {
      req.flash('warning', '新密码两次输入不一致');
      return res.redirect('/edit');
    }
    if (req.body.newpassword != '') {
      password = req.body.newpassword;
    }
    var user = new User.User(
      studentid,
      password,
      req.body.name,
      req.body.sex,
      req.body.departmentid,
      req.body.email,
      req.body.phone,
      req.body.renrenid
    );
    User.update(user, function(err) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/edit');
      } else {
        req.flash('info', '修改资料成功');
        return res.redirect('/');
      }
    });
  });
});

//login
app.get('/login', checkNotLogin);
app.get('/login', function(req, res) {
  res.render('login.jade', {
    name: 'login',
    user: req.session.user,
    flash: req.flash(),
  });
});

app.post('/login', checkNotLogin);
app.post('/login', function(req, res) {
  var studentid = req.body.studentid;
  var password = req.body.password;
  User.get(studentid, function(err, userinfo) {
    if (userinfo.length == 0 || userinfo[0].password != password) {
      req.flash('warning', '学号或密码错误');
      return res.redirect('/login');
    }
    req.session.user = studentid;
    req.flash('info', '登录成功');
    return res.redirect('/');
  });
});

//logout
app.get('/logout', function(req, res) {
  req.session.user = null;
  req.flash('info', '登出成功');
  return res.redirect('/');
});

//list
app.get('/list', function(req, res) {
  List.getAuthority(req.session.user, function(err, authority) {
    if (authority == false) {
      req.flash('warning', '抱歉，您没有权限查看');
      return res.redirect('/');
    }
    List.getAll(1, 1, function(err, list1) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/');
      }
      List.getAll(2, 2, function(err, list2) {
        if (err) {
          req.flash('warning', err);
          return res.redirect('/');
        }
        List.getAll(3, 3, function(err, list3) {
          if (err) {
            req.flash('warning', err);
            return res.redirect('/');
          }
          res.render('list.jade', {
            name: 'list',
            user: req.session.user,
            flash: req.flash(),
            list1: list1,
            list2: list2,
            list3: list3,
          });
        });
      });
    });
  });
});

app.start = function() {
  app.listen(app.get('port'), function() {
    console.log("Express server listening on port %d", app.get('port'));
  });
};

if (!module.parent) {
  app.start();
}

module.exports = app;

