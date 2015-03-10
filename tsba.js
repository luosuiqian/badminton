var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var app = express();

var cCheck = require('./controllers/ccheck');
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

app.set('port', 80);
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

app.all('/*', cCheck.log);

//===========================================================================//

app.get('/', cUser.indexGet);

//===========================================================================//

app.get('/application', cApplication.applicationGet);

app.post('/application', cCheck.checkLogin);
app.post('/application', cApplication.applicationPost);

app.get('/confirm', cCheck.checkLogin);
app.get('/confirm', cUser.confirmGet);

app.post('/confirm', cCheck.checkLogin);
app.post('/confirm', cUser.confirmPost);

var official1 = cActivity.official1();
app.get('/official1', official1.get);

app.post('/official1', cCheck.checkLogin);
app.post('/official1', official1.post);

var official2 = cActivity.official2();
app.get('/official2', official2.get);

app.post('/official2', cCheck.checkLogin);
app.post('/official2', official2.post);

app.get('/activity', cActivity.activityGet);

//===========================================================================//

app.get('/team/:year/Apply', cCheck.checkYear(2014, 2014));
app.get('/team/:year/Apply', cTeam.applyGet);

app.get('/team/:year/Apply/:dep', cCheck.checkYear(2014, 2014));
app.get('/team/:year/Apply/:dep', cCheck.checkTeamDep);
app.get('/team/:year/Apply/:dep', cCheck.checkLogin);
app.get('/team/:year/Apply/:dep', cTeam.applyDepGet);

app.get('/team/:year/Apply/:dep/:id', cCheck.checkYear(2014, 2014));
app.get('/team/:year/Apply/:dep/:id', cCheck.checkTeamDep);
app.get('/team/:year/Apply/:dep/:id', cCheck.checkTeamId);
app.get('/team/:year/Apply/:dep/:id', cCheck.checkLogin);
app.get('/team/:year/Apply/:dep/:id', cTeam.applyDepIdGet);

app.post('/team/:year/Apply/:dep/:id', cCheck.checkYear(2014, 2014));
app.post('/team/:year/Apply/:dep/:id', cCheck.checkTeamDep);
app.post('/team/:year/Apply/:dep/:id', cCheck.checkTeamId);
app.post('/team/:year/Apply/:dep/:id', cCheck.checkLogin);
app.post('/team/:year/Apply/:dep/:id', cTeam.applyDepIdPost);

app.get('/team/:year/admin', cCheck.checkYear(2014, 2014));
app.get('/team/:year/admin', cCheck.checkAuthority(3, 5));
app.get('/team/:year/admin', cTeam.adminListGet);

app.get('/team/:year/list', cCheck.checkYear(2013, 2014));
app.get('/team/:year/list', cCheck.checkAuthority(3, 5));
app.get('/team/:year/list', cTeam.userListGet);

app.get('/team/:year/Results/:type', cCheck.checkYear(2013, 2014));
app.get('/team/:year/Results/:type', cCheck.checkTeamType);
app.get('/team/:year/Results/:type', cTeam.resultsGet);

app.get('/team/:year/Details/:type/:teamId/:left/:right', cCheck.checkYear(2013, 2014));
app.get('/team/:year/Details/:type/:teamId/:left/:right', cTeam.resultsGetDetails);

//===========================================================================//

app.get('/individual/:year', cCheck.checkYear(2014, 2015));
app.get('/individual/:year', cIndividual.individualGet);

app.get('/individual/:year/Apply/:type', cCheck.checkYear(2014, 2015));
app.get('/individual/:year/Apply/:type', cCheck.checkIndTypeWithReferee);
app.get('/individual/:year/Apply/:type', cCheck.checkLogin);
app.get('/individual/:year/Apply/:type', cIndividual.individualApply);

app.post('/individual/:year', cCheck.checkYear(2014, 2015));
app.post('/individual/:year', cCheck.checkLogin);
app.post('/individual/:year', cIndividual.individualPost);

app.get('/individual/:year/Cancel/:type', cCheck.checkYear(2014, 2015));
app.get('/individual/:year/Cancel/:type', cCheck.checkIndTypeWithReferee);
app.get('/individual/:year/Cancel/:type', cCheck.checkLogin);
app.get('/individual/:year/Cancel/:type', cIndividual.individualCancel);

app.get('/individual/:year/Results/:type', cCheck.checkYear(2014, 2015));
app.get('/individual/:year/Results/:type', cCheck.checkIndTypeWithoutReferee);
app.get('/individual/:year/Results/:type', cIndividual.individualResults);

//===========================================================================//

app.get('/statistics/:superId', cStatistics.get);

//===========================================================================//

app.get('/referee', cCheck.checkLogin);
app.get('/referee', cReferee.refereeGet);

app.get('/referee/on', cCheck.checkLogin);
app.get('/referee/on', cReferee.refereeOn);

app.get('/referee/off', cCheck.checkLogin);
app.get('/referee/off', cReferee.refereeOff);

app.get('/referee/:year/:type/:leftP/:rightP', cCheck.checkLogin);
app.get('/referee/:year/:type/:leftP/:rightP', cReferee.matchIndex);

app.get('/referee/:year/:type/:leftP/:rightP/match', cCheck.checkLogin);
app.get('/referee/:year/:type/:leftP/:rightP/match', cReferee.matchGet);

app.post('/referee/:year/:type/:leftP/:rightP/match', cCheck.checkLogin);
app.post('/referee/:year/:type/:leftP/:rightP/match', cReferee.matchPost);

app.get('/referee/admin/:year', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year', cReferee.adminGet);

app.get('/referee/admin/:year/users', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year/users', cReferee.adminUsersGet);

app.get('/referee/admin/:year/matches', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year/matches', cReferee.adminMatchesGet);

app.get('/referee/admin/:year/referees', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year/referees', cReferee.adminRefereesGet);

app.post('/referee/admin/:year', cCheck.checkAuthority(5, 5));
app.post('/referee/admin/:year', cReferee.adminPost);

app.get('/referee/admin/:year/matchesDoing', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year/matchesDoing', cReferee.adminMatchesDoingGet);

app.get('/referee/admin/:year/screenAll', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year/screenAll', cReferee.screenAllGet);

app.get('/referee/admin/:year/screen/one/:id', cCheck.checkAuthority(5, 5));
app.get('/referee/admin/:year/screen/one/:id', cReferee.screenOneIdGet);

//===========================================================================//

app.get('/register', cCheck.checkNotLogin);
app.get('/register', cUser.registerGet);

app.get('/register/check', cUser.registerCheckGet);

app.post('/register', cCheck.checkNotLogin);
app.post('/register', cUser.registerPost);

app.get('/edit', cCheck.checkLogin);
app.get('/edit', cUser.editGet);

app.post('/edit', cCheck.checkLogin);
app.post('/edit', cUser.editPost);

app.get('/login', cCheck.checkNotLogin);
app.get('/login', cUser.loginGet);

app.post('/login', cCheck.checkNotLogin);
app.post('/login', cUser.loginPost);

app.get('/logout', cUser.logoutGet);

app.get('/map', cUser.mapGet);

app.get('/sign', cCheck.checkAuthority(3, 5));
app.get('/sign', cSign.signAllGet);

app.get('/sign/:id/:psw/signin', cCheck.checkAuthority(3, 5));
app.get('/sign/:id/:psw/signin', cSign.signInGet);

app.get('/sign/:id/:psw', cCheck.checkAuthority(3, 5));
app.get('/sign/:id/:psw', cSign.signStuGet);

app.post('/sign/:id/:psw', cCheck.checkAuthority(4, 5));
app.post('/sign/:id/:psw', cSign.signStuPost);

app.get('/list', cCheck.checkAuthority(3, 5));
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

