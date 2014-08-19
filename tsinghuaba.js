var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var app = express();

var Global = require('./models/global');
var User = require('./models/user');
var Department = require('./models/department');
var Authority = require('./models/authority');
var List = require('./models/list');
var Application = require('./models/application');
var Individual = require('./models/individual');
var IndMatch = require('./models/indMatch');

app.set('port', 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.urlencoded())
app.use(express.json())
app.use(express.cookieParser());
app.use(express.session({
  secret: 'SXLlGmJfOZhCtzxtqp9T',
  store: require('./models/db').getStore(express)
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

var checkLogin = function (req, res, next) {
  if (req.session.user == null) {
    req.flash('warning', '请先登录');
    return res.redirect('/login');
  }
  next();
};

var checkNotLogin = function (req, res, next) {
  if (req.session.user != null) {
    req.flash('warning', '请先登出');
    return res.redirect('/');
  }
  next();
};

//===========================================================================//
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
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Application.getAll(function(err, table) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      Application.getStudentid(req.session.user, function(err, result) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        res.render('application.jade', {
          name: 'application',
          user: req.session.user,
          flash: req.flash(),
          open: Global.checkTimeForApplication(),
          time: Global.getTimeForApplication(),
          sex: (userinfo != null) ? userinfo.sex : null,
          table: table,
          result: result,
        });
      });
    });
  });
});

app.post('/application', checkLogin);
app.post('/application', function(req, res) {
  if (Global.checkTimeForApplication() == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/application');
  }
  if (req.body.type == 'delete') {
    Application.del(req.session.user, function(err) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/application');
      }
      req.flash('info', '取消报名成功');
      return res.redirect('/application');
    });
  } else if (req.body.type == 'post') {
    Application.save(req.body.timespace, req.session.user, function(err) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/application');
      } else {
        req.flash('info', '报名成功');
        return res.redirect('/application');
      }
    });
  }
});

//===========================================================================//
//activity
var request = function (activity) {
  var ret = new Object();
  ret.get = function (req, res) {
    activity.getAuthority(req.session.user, function(err, authority) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      activity.checkTime();
      activity.getAll(function(err, table) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        activity.getStudentid(req.session.user, function(err, result) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          res.render('activity.jade', {
            name: 'activity',
            user: req.session.user,
            flash: req.flash(),
            open: activity.checkTime(),
            time: activity.getTime(),
            authority: authority,
            table: table,
            result: result,
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
            req.flash('warning', err.toString());
            return res.redirect('.');
          } else {
            req.flash('info', '取消报名成功');
            return res.redirect('.');
          }
        });
      } else if (req.body.type == 'post') {
        activity.save(req.body.timespace, req.session.user, function(err) {
          if (err) {
            req.flash('warning', err.toString());
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
var crowdThursday = Global.getCrowdThursday(request);
app.get('/crowdThursday', crowdThursday.get);
app.post('/crowdThursday', checkLogin);
app.post('/crowdThursday', crowdThursday.post);

var crowdFriday = Global.getCrowdFriday(request);
app.get('/crowdFriday', crowdFriday.get);
app.post('/crowdFriday', checkLogin);
app.post('/crowdFriday', crowdFriday.post);

var activityFriday = Global.getActivityFriday(request);
app.get('/activityFriday', activityFriday.get);
app.post('/activityFriday', checkLogin);
app.post('/activityFriday', activityFriday.post);

var activitySaturday = Global.getActivitySaturday(request);
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
//individual
var individual = function (year, req, res) {
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Individual.get(year, 1, function(err, mens_singles) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      Individual.get(year, 3, function(err, mens_doubles) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        Individual.get(year, 4, function(err, womens_doubles) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          Individual.get(year, 5, function(err, mixed_doubles) {
            if (err) {
              req.flash('warning', err.toString());
              return res.redirect('/');
            }
            Individual.get(year, 9, function(err, referee) {
              if (err) {
                req.flash('warning', err.toString());
                return res.redirect('/');
              }
              res.render('individual' + year + '.jade', {
                name: 'individual',
                user: req.session.user,
                flash: req.flash(),
                mens_singles: mens_singles,
                mens_doubles: mens_doubles,
                womens_doubles: womens_doubles,
                mixed_doubles: mixed_doubles,
                referee: referee,
                year: year,
                open: Global.checkTimeForIndividual(year),
                time: Global.getTimeForIndividual(year),
                sex: (userinfo != null) ? userinfo.sex : null,
              });
            });
          });
        });
      });
    });
  });
};

var individualApply = function (year, type, req, res) {
  if (Global.checkTimeForIndividual(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual_' + year);
  }
  User.get(req.session.user, function(err, userinfo) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Department.getAll(function(err, departments) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      var p12 = Individual.getP1andP2(type, userinfo);
      if (p12 == null) {
        req.flash('warning', '报名类型错误');
        return res.redirect('/');
      }
      res.render('individualApply.jade', {
        name: 'individual',
        user: req.session.user,
        flash: req.flash(),
        departments: departments,
        year: year,
        type: type,
        player1: p12[0],
        player2: p12[1],
      });
    });
  });
};

var individualPost = function (year, req, res) {
  if (Global.checkTimeForIndividual(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual_' + year);
  }
  Individual.save(year, req.body, req.session.user, function(err) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/individual_' + year);
    } else {
      req.flash('info', '报名成功');
      return res.redirect('/individual_' + year);
    }
  });
};

var individualCancel = function (year, type, req, res) {
  if (Global.checkTimeForIndividual(year) == false) {
    req.flash('warning', '现在不是报名时间');
    return res.redirect('/individual_' + year);
  }
  Individual.del(year, req.session.user, type, function(err) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    req.flash('info', '取消报名成功');
    return res.redirect('/individual_' + year);
  });
};

app.get('/individual_2014', function(req, res) {individual(2014, req, res);});

app.get('/individual_2014_Apply_mens_singles', checkLogin);
app.get('/individual_2014_Apply_mens_singles', function(req, res) {individualApply(2014, 1, req, res);});
app.get('/individual_2014_Apply_mens_doubles', checkLogin);
app.get('/individual_2014_Apply_mens_doubles', function(req, res) {individualApply(2014, 3, req, res);});
app.get('/individual_2014_Apply_womens_doubles', checkLogin);
app.get('/individual_2014_Apply_womens_doubles', function(req, res) {individualApply(2014, 4, req, res);});
app.get('/individual_2014_Apply_mixed_doubles', checkLogin);
app.get('/individual_2014_Apply_mixed_doubles', function(req, res) {individualApply(2014, 5, req, res);});
app.get('/individual_2014_Apply_referee', checkLogin);
app.get('/individual_2014_Apply_referee', function(req, res) {individualApply(2014, 9, req, res);});

app.post('/individual_2014', checkLogin);
app.post('/individual_2014', function(req, res) {individualPost(2014, req, res);});

app.get('/individual_2014_Cancel_mens_singles', checkLogin);
app.get('/individual_2014_Cancel_mens_singles', function(req, res) {individualCancel(2014, 1, req, res);});
app.get('/individual_2014_Cancel_mens_doubles', checkLogin);
app.get('/individual_2014_Cancel_mens_doubles', function(req, res) {individualCancel(2014, 3, req, res);});
app.get('/individual_2014_Cancel_womens_doubles', checkLogin);
app.get('/individual_2014_Cancel_womens_doubles', function(req, res) {individualCancel(2014, 4, req, res);});
app.get('/individual_2014_Cancel_mixed_doubles', checkLogin);
app.get('/individual_2014_Cancel_mixed_doubles', function(req, res) {individualCancel(2014, 5, req, res);});
app.get('/individual_2014_Cancel_referee', checkLogin);
app.get('/individual_2014_Cancel_referee', function(req, res) {individualCancel(2014, 9, req, res);});

app.get('/individual_2015', function(req, res) {individual(2015, req, res);});

app.get('/individual_2015_Apply_mens_singles', checkLogin);
app.get('/individual_2015_Apply_mens_singles', function(req, res) {individualApply(2015, 1, req, res);});
app.get('/individual_2015_Apply_mens_doubles', checkLogin);
app.get('/individual_2015_Apply_mens_doubles', function(req, res) {individualApply(2015, 3, req, res);});
app.get('/individual_2015_Apply_womens_doubles', checkLogin);
app.get('/individual_2015_Apply_womens_doubles', function(req, res) {individualApply(2015, 4, req, res);});
app.get('/individual_2015_Apply_mixed_doubles', checkLogin);
app.get('/individual_2015_Apply_mixed_doubles', function(req, res) {individualApply(2015, 5, req, res);});
app.get('/individual_2015_Apply_referee', checkLogin);
app.get('/individual_2015_Apply_referee', function(req, res) {individualApply(2015, 9, req, res);});

app.post('/individual_2015', checkLogin);
app.post('/individual_2015', function(req, res) {individualPost(2015, req, res);});

app.get('/individual_2015_Cancel_mens_singles', checkLogin);
app.get('/individual_2015_Cancel_mens_singles', function(req, res) {individualCancel(2015, 1, req, res);});
app.get('/individual_2015_Cancel_mens_doubles', checkLogin);
app.get('/individual_2015_Cancel_mens_doubles', function(req, res) {individualCancel(2015, 3, req, res);});
app.get('/individual_2015_Cancel_womens_doubles', checkLogin);
app.get('/individual_2015_Cancel_womens_doubles', function(req, res) {individualCancel(2015, 4, req, res);});
app.get('/individual_2015_Cancel_mixed_doubles', checkLogin);
app.get('/individual_2015_Cancel_mixed_doubles', function(req, res) {individualCancel(2015, 5, req, res);});
app.get('/individual_2015_Cancel_referee', checkLogin);
app.get('/individual_2015_Cancel_referee', function(req, res) {individualCancel(2015, 9, req, res);});

//===========================================================================//

var individualResults = function (year, type, req, res) {
  IndMatch.get(year, type, function(err, table) {
    if (err) {
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    res.render('individualResults.jade', {
      name: 'individual',
      user: req.session.user,
      flash: req.flash(),
      year: year,
      type: type,
      table: table,
    });
  });
};

app.get('/individual_2014_Results_mens_singles', function(req, res) {individualResults(2014, 1, req, res);});
app.get('/individual_2014_Results_mens_doubles', function(req, res) {individualResults(2014, 3, req, res);});
app.get('/individual_2014_Results_womens_doubles', function(req, res) {individualResults(2014, 4, req, res);});
app.get('/individual_2014_Results_mixed_doubles', function(req, res) {individualResults(2014, 5, req, res);});

//===========================================================================//
//register
app.get('/register', checkNotLogin);
app.get('/register', function(req, res) {
  Department.getAll(function(err, departments) {
    if (err) {
      req.flash('warning', err.toString());
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
  User.save(req.body, function(err) {
    if (err) {
      req.flash('warning', err.toString() + '，您可以用浏览器的后退功能重新填写表单');
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
      req.flash('warning', err.toString());
      return res.redirect('/');
    }
    Department.getAll(function(err, departments) {
      if (err) {
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      res.render('edit.jade', {
        name: 'edit',
        user: req.session.user,
        flash: req.flash(),
        departments: departments,
        userinfo: userinfo,
      });
    });
  });
});

app.post('/edit', checkLogin);
app.post('/edit', function(req, res) {
  User.get(req.session.user, function(err, userinfo) {
    if (userinfo.password != req.body.password) {
      req.flash('warning', '密码错误');
      return res.redirect('/edit');
    }
    if (req.body.newpassword != req.body.repeatpassword) {
      req.flash('warning', '新密码两次输入不一致');
      return res.redirect('/edit');
    }
    req.body.studentid = req.session.user;
    if (req.body.newpassword != '') {
      req.body.password = req.body.newpassword;
    }
    User.update(req.body, function(err) {
      if (err) {
        req.flash('warning', err.toString());
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
  User.get(req.body.studentid, function(err, userinfo) {
    if (userinfo == null || userinfo.password != req.body.password) {
      req.flash('warning', '学号或密码错误');
      return res.redirect('/login');
    }
    req.session.user = req.body.studentid;
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
        req.flash('warning', err.toString());
        return res.redirect('/');
      }
      List.getAll(1, 1, function(err, list1) {
        if (err) {
          req.flash('warning', err.toString());
          return res.redirect('/');
        }
        List.getAll(2, 2, function(err, list2) {
          if (err) {
            req.flash('warning', err.toString());
            return res.redirect('/');
          }
          List.getAll(3, 3, function(err, list3) {
            if (err) {
              req.flash('warning', err.toString());
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

//===========================================================================//

app.start = function() {
  app.listen(app.get('port'), function() {
    console.log("Express server listening on port %d", app.get('port'));
  });
};

if (!module.parent) {
  app.start();
}

module.exports = app;

