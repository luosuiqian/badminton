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
var cStatistics = require('./controllers/cstatistics');
var cReferee = require('./controllers/creferee');

var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/img/favicon.png'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  key: 'sessions',
  secret: 'SXLlGmJfOZhCtzxtqp9T',
  store: require('./models/db').getStore()
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

//===========================================================================//

app.all('/*', cUser.log);

//===========================================================================//

app.get('/', cUser.indexGet);

//===========================================================================//

app.get('/application', cApplication.applicationGet);
app.post('/application', cUser.checkLogin);
app.post('/application', cApplication.applicationPost);

app.get('/confirm', cUser.checkLogin);
app.get('/confirm', cUser.confirmGet);
app.post('/confirm', cUser.checkLogin);
app.post('/confirm', cUser.confirmPost);

var official1 = cActivity.official1();
app.get('/official1', official1.get);
app.post('/official1', cUser.checkLogin);
app.post('/official1', official1.post);

var official2 = cActivity.official2();
app.get('/official2', official2.get);
app.post('/official2', cUser.checkLogin);
app.post('/official2', official2.post);

app.get('/activity', cActivity.activityGet);

//===========================================================================//

app.get('/team/:year/Apply', cTeam.applyGet);

app.get('/team/:year/Apply/:dep', cUser.checkLogin);
app.get('/team/:year/Apply/:dep', cTeam.applyDepGet);

app.get('/team/:year/Apply/:dep/:id', cUser.checkLogin);
app.get('/team/:year/Apply/:dep/:id', cTeam.applyDepIdGet);
app.post('/team/:year/Apply/:dep/:id', cUser.checkLogin);
app.post('/team/:year/Apply/:dep/:id', cTeam.applyDepIdPost);

app.get('/team/:year/admin', cTeam.adminListGet);

app.get('/team/:year/list', cTeam.userListGet);
app.get('/team/:year/Results/:type', cTeam.resultsGet);
app.get('/team/:year/Details/:type/:teamId/:left/:right', cTeam.resultsGetDetails);

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

app.get('/statistics/:superId', cStatistics.get);

//===========================================================================//

app.get('/referee', cUser.checkLogin);
app.get('/referee', cReferee.refereeGet);

app.get('/referee/on', cUser.checkLogin);
app.get('/referee/on', cReferee.refereeOn);
app.get('/referee/off', cUser.checkLogin);
app.get('/referee/off', cReferee.refereeOff);

app.get('/referee/:year/:type/:leftP/:rightP', cUser.checkLogin);
app.get('/referee/:year/:type/:leftP/:rightP', cReferee.matchIndex);
app.get('/referee/:year/:type/:leftP/:rightP/match', cUser.checkLogin);
app.get('/referee/:year/:type/:leftP/:rightP/match', cReferee.matchGet);
app.post('/referee/:year/:type/:leftP/:rightP/match', cUser.checkLogin);
app.post('/referee/:year/:type/:leftP/:rightP/match', cReferee.matchPost);

app.get('/referee/admin/:year', cReferee.adminGet);
app.get('/referee/admin/:year/users', cReferee.adminUsersGet);
app.get('/referee/admin/:year/matches', cReferee.adminMatchesGet);
app.get('/referee/admin/:year/referees', cReferee.adminRefereesGet);
app.post('/referee/admin/:year', cReferee.adminPost);

//===========================================================================//

app.get('/register', cUser.checkNotLogin);
app.get('/register', cUser.registerGet);
app.get('/register/check', cUser.registerCheckGet);
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

app.get('/qrcode', cUser.checkLogin);
app.get('/qrcode', cSign.qucodeGet);

app.get('/map', cUser.mapGet);

app.get('/sign', cSign.signAllGet);
app.get('/sign/:id/:psw/signin', cSign.signInGet);
app.get('/sign/:id/:psw', cSign.signStuGet);
app.post('/sign/:id/:psw', cSign.signStuPost);

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

