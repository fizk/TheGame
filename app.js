var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FB = require('fb');
var swig = require('swig');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var config = require('./config');



//Facebook
passport.serializeUser(function(user, done){
	done(null, user.id);
});
passport.deserializeUser(function(obj, done){
	db.collection('users').findOne({id:obj},function(error,data){
		done(null, data);
	});
});

passport.use( new FacebookStrategy({
	clientID: config.fb.appID,
	clientSecret: config.fb.appSecret,
	callbackURL: config.fb.url + 'auth/callback'
},function(accessToken, refreshToken, profile, done){
	FB.setAccessToken(accessToken);
	db.collection('users').findOne({id:profile.id},function(error, data){
		if(!data){
			db.collection('users').save({
				id: profile.id,
				username: profile.username,
				displayName: profile.displayName,
				profileUrl: profile.profileUrl,
				admin:false,
				emails: profile.emails,
				provider: profile.provider
			},function(){});
		}
		profile.access_token = accessToken;
		done(null,profile);
	});
}) );


// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(__dirname + '/public/stylesheets/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret:'this is my secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest:'./public/images/'}));

//MONGO-DB
//	configure MongoDB client
var db = undefined;
MongoClient.connect(config.dbUrl, function(err, database) {
	if(err) throw err;
	db = database;
});
app.use(function(req, res, next){
	req.db = db;
	res.locals.user = req.user; //make user global to all views
	req.facebook = FB;
	next();
})

app.use('/', routes);
app.use('/users', users);
app.use('/auth/login',passport.authenticate('facebook',{ scope:'publish_actions' }));
app.use('/auth/logout',function(request, response){
	request.logOut();
	response.redirect('/');
});
app.use('/auth/callback',passport.authenticate('facebook',{ failureRedirect:'/',successRedirect:'/' }),function(req, res){
	res.redirect('/');
});
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
