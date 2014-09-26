var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var app = express();

var cUser = require('./controllers/cuser');
var cApplication = require('./controllers/capplication');
var cActivity = require('./controllers/cactivity');
var cTeam = require('./controllers/cteam');
var cSign = require('./controllers/csign');
var cIndividual = require('./controllers/cindividual');

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

//===========================================================================//

app.all('/*', cUser.log);

//===========================================================================//

app.get('/', cUser.indexGet);

app.get('/application', cApplication.applicationGet);
app.post('/application', cUser.checkLogin);
app.post('/application', cApplication.applicationPost);

/*
app.get('/confirm', cUser.checkLogin);
app.get('/confirm', cUser.confirmGet);
app.post('/confirm', cUser.checkLogin);
app.post('/confirm', cUser.confirmPost);
*/
//===========================================================================//
/*
var crowdThursday = cActivity.crowdThursday();
app.get('/crowdThursday', crowdThursday.get);
app.post('/crowdThursday', cUser.checkLogin);
app.post('/crowdThursday', crowdThursday.post);

var crowdFriday = cActivity.crowdFriday();
app.get('/crowdFriday', crowdFriday.get);
app.post('/crowdFriday', cUser.checkLogin);
app.post('/crowdFriday', crowdFriday.post);

var activityFriday = cActivity.activityFriday();
app.get('/activityFriday', activityFriday.get);
app.post('/activityFriday', cUser.checkLogin);
app.post('/activityFriday', activityFriday.post);

var activitySaturday = cActivity.activitySaturday();
app.get('/activitySaturday', activitySaturday.get);
app.post('/activitySaturday', cUser.checkLogin);
app.post('/activitySaturday', activitySaturday.post);
*/
app.get('/activity', cActivity.activityGet);

//===========================================================================//

app.get('/team/:year/Apply', cTeam.applyGet);

app.get('/team/:year/Apply/:dep', cUser.checkLogin);
app.get('/team/:year/Apply/:dep', cTeam.applyDepGet);

app.get('/team/:year/Apply/:dep/:id', cUser.checkLogin);
app.get('/team/:year/Apply/:dep/:id', cTeam.applyDepIdGet);
app.post('/team/:year/Apply/:dep/:id', cUser.checkLogin);
app.post('/team/:year/Apply/:dep/:id', cTeam.applyDepIdPost);
/*
app.get('/team/:year/list', cTeam.userListGet);

app.get('/team/:year/Results/:type', cTeam.resultsGet);
*/
//===========================================================================//

app.get('/individual/:year', cIndividual.individualGet);

app.get('/individual/:year/Apply/:type', cUser.checkLogin);
app.get('/individual/:year/Apply/:type', cIndividual.individualApply);

app.post('/individual/:year', cUser.checkLogin);
app.post('/individual/:year', cIndividual.individualPost);

app.get('/individual/:year/Cancel/:type', cUser.checkLogin);
app.get('/individual/:year/Cancel/:type', cIndividual.individualCancel);

app.get('/individual/:year/Results/:type', cIndividual.individualResults);

//===========================================================================//

app.get('/sign', cSign.signGet);

app.get('/sign/:id/:psw', cSign.signStuGet);
app.post('/sign/:id/:psw', cSign.signStuPost);

app.get('/sign/:id/:psw/signin', cSign.signStuSigninGet);

app.get('/qrcode', cUser.checkLogin);
app.get('/qrcode', cSign.qucodeGet);

//===========================================================================//

app.get('/map', cUser.mapGet);

app.get('/register', cUser.checkNotLogin);
app.get('/register', cUser.registerGet);
app.post('/register', cUser.checkNotLogin);
app.post('/register', cUser.registerPost);

app.get('/edit', cUser.checkLogin);
app.get('/edit', cUser.editGet);
app.post('/edit', cUser.checkLogin);
app.post('/edit', cUser.editPost);

app.get('/login', cUser.checkNotLogin);
app.get('/login', cUser.loginGet);
app.post('/login', cUser.checkNotLogin);
app.post('/login', cUser.loginPost);

app.get('/logout', cUser.logoutGet);

app.get('/list', cUser.listGet);

//===========================================================================//

app.get('/Emily', function(req, res) {
  return res.redirect('http://wangqian0627.github.io');
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

