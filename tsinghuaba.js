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
var Individual = require('./models/individual');
var IndMatch = require('./models/indMatch');

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

//individual
app.get('/individual', function(req, res) {
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/');
    }
    Individual.get(2014, 1, function(err, mens_singles) {
      if (err) {
        req.flash('warning', err);
        return res.redirect('/');
      }
      Individual.get(2014, 3, function(err, mens_doubles) {
        if (err) {
          req.flash('warning', err);
          return res.redirect('/');
        }
        Individual.get(2014, 4, function(err, womens_doubles) {
          if (err) {
            req.flash('warning', err);
            return res.redirect('/');
          }
          Individual.get(2014, 5, function(err, mixed_doubles) {
            if (err) {
              req.flash('warning', err);
              return res.redirect('/');
            }
            Individual.get(2014, 9, function(err, referee) {
              if (err) {
                req.flash('warning', err);
                return res.redirect('/');
              }
              res.render('individual.jade', {
                name: 'individual',
                user: req.session.user,
                flash: req.flash(),
                mens_singles: mens_singles,
                mens_doubles: mens_doubles,
                womens_doubles: womens_doubles,
                mixed_doubles: mixed_doubles,
                referee: referee,
                sex: (userinfo != null)?userinfo[0].sex:null,
              });
            });
          });
        });
      });
    });
  });
});

var Player = function (userinfo) {
  this.studentid = userinfo.studentid;
  this.name = userinfo.name;
  this.sex = userinfo.sex;
  this.departmentid = parseInt(userinfo.departmentid);
  this.email = userinfo.email;
  this.phone = userinfo.phone;
  this.edit = false;
}

var NewPlayer = function (sex) {
  this.studentid = "";
  this.name = "";
  this.sex = sex;
  this.departmentid = 1;
  this.email = "";
  this.phone = "";
  this.edit = true;
}

function individualApply(type, req, res) {
  if (Individual.checkTime() == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual');
  }
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
      var sex = userinfo[0].sex;
      if (type == 1 && sex == 'm') {
        var p1 = new Player(userinfo[0]);
        var p2 = null;
      } else if (type == 3 && sex == 'm') {
        var p1 = new Player(userinfo[0]);
        var p2 = new NewPlayer('m');
      } else if (type == 4 && sex == 'f') {
        var p1 = new Player(userinfo[0]);
        var p2 = new NewPlayer('f');
      } else if (type == 5 && sex == 'm') {
        var p1 = new Player(userinfo[0]);
        var p2 = new NewPlayer('f');
      } else if (type == 5 && sex == 'f') {
        var p1 = new NewPlayer('m');
        var p2 = new Player(userinfo[0]);
      } else if (type == 9) {
        var p1 = new Player(userinfo[0]);
        var p2 = null;
      } else {
        req.flash('warning', '报名类型错误');
        return res.redirect('/');
      }
      res.render('individualApply.jade', {
        name: 'individual',
        user: req.session.user,
        flash: req.flash(),
        open: Individual.checkTime(),
        departments: departments,
        type: type,
        player1: p1,
        player2: p2,
      });
    });
  });
}

app.get('/individualApply_mens_singles', checkLogin);
app.get('/individualApply_mens_singles', function(req, res) {individualApply(1, req, res);});
app.get('/individualApply_mens_doubles', checkLogin);
app.get('/individualApply_mens_doubles', function(req, res) {individualApply(3, req, res);});
app.get('/individualApply_womens_doubles', checkLogin);
app.get('/individualApply_womens_doubles', function(req, res) {individualApply(4, req, res);});
app.get('/individualApply_mixed_doubles', checkLogin);
app.get('/individualApply_mixed_doubles', function(req, res) {individualApply(5, req, res);});
app.get('/individualApply_referee', checkLogin);
app.get('/individualApply_referee', function(req, res) {individualApply(9, req, res);});

function individualCancel(type, req, res) {
  if (Individual.checkTime() == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual');
  }
  Individual.del(2014, req.session.user, type, function(err) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/');
    }
    return res.redirect('/individual');
  });
}

app.get('/individualCancel_mens_singles', checkLogin);
app.get('/individualCancel_mens_singles', function(req, res) {individualCancel(1, req, res);});
app.get('/individualCancel_mens_doubles', checkLogin);
app.get('/individualCancel_mens_doubles', function(req, res) {individualCancel(3, req, res);});
app.get('/individualCancel_womens_doubles', checkLogin);
app.get('/individualCancel_womens_doubles', function(req, res) {individualCancel(4, req, res);});
app.get('/individualCancel_mixed_doubles', checkLogin);
app.get('/individualCancel_mixed_doubles', function(req, res) {individualCancel(5, req, res);});
app.get('/individualCancel_referee', checkLogin);
app.get('/individualCancel_referee', function(req, res) {individualCancel(9, req, res);});

app.post('/individual', checkLogin);
app.post('/individual', function(req, res) {
  if (Individual.checkTime() == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual');
  }
  var newApply;
  if (parseInt(req.body.type) == 1 || parseInt(req.body.type) == 9) {
    newApply = new Individual.NewApply(
      2014,
      req.session.user,
      req.body.type,
      req.body.studentid1,
      req.body.name1,
      req.body.departmentid1,
      req.body.email1,
      req.body.phone1,
      null,null,null,null,null
    );
  } else if (3 <= parseInt(req.body.type) && parseInt(req.body.type) <= 5) {
    newApply = new Individual.NewApply(
      2014,
      req.session.user,
      req.body.type,
      req.body.studentid1,
      req.body.name1,
      req.body.departmentid1,
      req.body.email1,
      req.body.phone1,
      req.body.studentid2,
      req.body.name2,
      req.body.departmentid2,
      req.body.email2,
      req.body.phone2
    );
  }
  Individual.save(newApply, function(err) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/individual');
    } else {
      req.flash('info', '报名成功');
      return res.redirect('/individual');
    }
  });
});

function individualResults(year, type, req, res) {
  IndMatch.get(year, type, function(err, table) {
    if (err) {
      req.flash('warning', err);
      return res.redirect('/');
    }
    res.render('individualResults.jade', {
      name: 'individual',
      user: req.session.user,
      flash: req.flash(),
      type: type,
      table: table,
    });
  });
}

app.get('/individualResults_mens_singles', function(req, res) {individualResults(2014, 1, req, res);});
app.get('/individualResults_mens_doubles', function(req, res) {individualResults(2014, 3, req, res);});
app.get('/individualResults_womens_doubles', function(req, res) {individualResults(2014, 4, req, res);});
app.get('/individualResults_mixed_doubles', function(req, res) {individualResults(2014,5, req, res);});

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

//===========================================================================//
//*
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

//*/

app.get('/activity', function(req, res) {
  res.render('activityClosed.jade', {
    name: 'activity',
    user: req.session.user,
    flash: req.flash(),
  });
});
//*/
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
    List.getAllNoAuthority(function(err, list0) {
      if (err) {
        req.flash('warning', err);
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
              list0: list0,
              list1: list1,
              list2: list2,
              list3: list3,
            });
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

