var express = require('express');
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
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/img/favicon.png'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(session({
  resave: true,
  saveUninitialized: true,
  key: 'sessions',
  secret: 'SXLlGmJfOZhCtzxtqp9T',
  store: require('./models/db').getStore()
}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cCheck.log);
app.use(cCheck.error);

//===========================================================================//

app.get('/', [
  cUser.indexGet,
]);

//===========================================================================//
/*
app.get('/confirm', [
  cCheck.checkLogin,
  cUser.confirmGet,
]);

app.post('/confirm', [
  cCheck.checkLogin,
  cUser.confirmPost,
]);
//*/
app.get('/application', [
  cApplication.applicationGet,
]);

app.post('/application', [
  cCheck.checkLogin,
  cApplication.applicationPost,
]);

var official1 = cActivity.official1();

app.get('/official1', [
  official1.get,
]);

app.post('/official1', [
  cCheck.checkLogin,
  official1.post,
]);

var official2 = cActivity.official2();

app.get('/official2', [
  official2.get,
]);

app.post('/official2', [
  cCheck.checkLogin,
  official2.post,
]);

app.get('/activity', [
  cActivity.activityGet,
]);

//===========================================================================//

app.get('/team/:year/Apply', [
  cCheck.checkYear(2014, 2014),
  cTeam.applyGet,
]);

app.get('/team/:year/Apply/:dep', [
  cCheck.checkYear(2014, 2014),
  cCheck.checkTeamDep,
  cCheck.checkLogin,
  cTeam.applyDepGet,
]);

app.get('/team/:year/Apply/:dep/:id', [
  cCheck.checkYear(2014, 2014),
  cCheck.checkTeamDep,
  cCheck.checkTeamId,
  cCheck.checkLogin,
  cTeam.applyDepIdGet,
]);

app.post('/team/:year/Apply/:dep/:id', [
  cCheck.checkYear(2014, 2014),
  cCheck.checkTeamDep,
  cCheck.checkTeamId,
  cCheck.checkLogin,
  cTeam.applyDepIdPost,
]);

app.get('/team/:year/admin', [
  cCheck.checkYear(2014, 2014),
  cCheck.checkAuthority(3, 5),
  cTeam.adminListGet,
]);

app.get('/team/:year/list', [
  cCheck.checkYear(2013, 2014),
  cTeam.userListGet,
]);

app.get('/team/:year/Results/:type', [
  cCheck.checkYear(2013, 2014),
  cCheck.checkTeamType,
  cTeam.resultsGet,
]);

app.get('/team/:year/Details/:type/:teamId/:left/:right', [
  cCheck.checkYear(2013, 2014),
  cTeam.resultsGetDetails,
]);

//===========================================================================//

app.get('/individual/:year', [
  cCheck.checkYear(2014, 2015),
  cIndividual.individualGet,
]);

app.get('/individual/:year/Apply/:type', [
  cCheck.checkYear(2014, 2015),
  cCheck.checkIndTypeWithReferee,
  cCheck.checkLogin,
  cIndividual.individualApply,
]);

app.post('/individual/:year', [
  cCheck.checkYear(2014, 2015),
  cCheck.checkLogin,
  cIndividual.individualPost,
]);

app.get('/individual/:year/Cancel/:type', [
  cCheck.checkYear(2014, 2015),
  cCheck.checkIndTypeWithReferee,
  cCheck.checkLogin,
  cIndividual.individualCancel,
]);

app.get('/individual/:year/Results/:type', [
  cCheck.checkYear(2014, 2015),
  cCheck.checkIndTypeWithoutReferee,
  cIndividual.individualResults,
]);

app.get('/individual/scores/:year/:type/:leftP/:rightP', [
  cIndividual.getOneMatch,
]);

//===========================================================================//

app.get('/referee', [
  cCheck.checkLogin,
  cReferee.refereeGet,
]);

app.get('/referee/on', [
  cCheck.checkLogin,
  cReferee.refereeOn,
]);

app.get('/referee/off', [
  cCheck.checkLogin,
  cReferee.refereeOff,
]);

app.get('/referee/:year/:type/:leftP/:rightP', [
  cCheck.checkLogin,
  cReferee.matchIndex,
]);

app.get('/referee/:year/:type/:leftP/:rightP/match', [
  cCheck.checkLogin,
  cReferee.matchGet,
]);

app.post('/referee/:year/:type/:leftP/:rightP/match', [
  cCheck.checkLogin,
  cReferee.matchPost,
]);

app.get('/referee/admin/:year', [
  cCheck.checkAuthority(5, 5),
  cReferee.adminGet,
]);

app.get('/referee/admin/:year/users', [
  cCheck.checkAuthority(5, 5),
  cReferee.adminUsersGet,
]);

app.get('/referee/admin/:year/matches', [
  cCheck.checkAuthority(5, 5),
  cReferee.adminMatchesGet,
]);

app.get('/referee/admin/:year/referees', [
  cCheck.checkAuthority(5, 5),
  cReferee.adminRefereesGet,
]);

app.post('/referee/admin/:year', [
  cCheck.checkAuthority(5, 5),
  cReferee.adminPost,
]);

app.get('/referee/admin/:year/matchesDoing', [
  cCheck.checkAuthority(5, 5),
  cReferee.adminMatchesDoingGet,
]);

app.get('/referee/admin/:year/screenAll', [
  cCheck.checkAuthority(5, 5),
  cReferee.screenAllGet,
]);

app.get('/referee/admin/:year/screen/one/:id', [
  cCheck.checkAuthority(5, 5),
  cReferee.screenOneIdGet,
]);

//===========================================================================//

app.get('/register', [
  cCheck.checkNotLogin,
  cUser.registerGet,
]);

app.get('/register/check', [
  cCheck.checkNotLogin,
  cUser.registerCheckGet,
]);

app.post('/register', [
  cCheck.checkNotLogin,
  cUser.registerPost,
]);

app.get('/edit', [
  cCheck.checkLogin,
  cUser.editGet,
]);

app.post('/edit', [
  cCheck.checkLogin,
  cUser.editPost,
]);

app.get('/login', [
  cCheck.checkNotLogin,
  cUser.loginGet,
]);

app.post('/login', [
  cCheck.checkNotLogin,
  cUser.loginPost,
]);

app.get('/logout', [
  cCheck.checkLogin,
  cUser.logoutGet,
]);

app.get('/map', [
  cUser.mapGet,
]);

app.get('/sign', [
  cCheck.checkAuthority(3, 5),
  cSign.signAllGet,
]);

app.get('/sign/:id/:psw/signin', [
  cCheck.checkAuthority(3, 5),
  cSign.signInGet,
]);

app.get('/sign/:id/:psw', [
  cCheck.checkAuthority(3, 5),
  cSign.signStuGet,
]);

app.post('/sign/:id/:psw', [
  cCheck.checkAuthority(4, 5),
  cSign.signStuPost,
]);

app.get('/list', [
  cCheck.checkAuthority(3, 5),
  cUser.listGet,
]);

app.get('/statistics/:superId', [
  cStatistics.get,
]);

//===========================================================================//

app.use(cCheck.notFound);

app.start = function () {
  app.listen(app.get('port'), function() {
    console.log("Express server listening on port %d", app.get('port'));
  });
};

if (!module.parent) {
  app.start();
}

module.exports = app;

