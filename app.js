var express = require('express');
var path = require('path');
var util = require('util');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mysql = require('mysql');

var cookieParser = require('cookie-parser');

var session  = require('express-session');


const CLIENTS = "SELECT * from clients";
const BABYSITTER = "SELECT * from babysitter";
const USER = "SELECT * from clienttype where UID = '%s'";


var firebase = require('firebase');


var connection = mysql.createConnection({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4"
}, 'request');


// Initialize Firebase
const config = {
    apiKey: "AIzaSyBP1B8MFHnGkg5VRoezvj3ozEg_yEDPZ84",
    authDomain: "pamperme-15d4e.firebaseapp.com",
    databaseURL: "https://pamperme-15d4e.firebaseio.com",
    storageBucket: "pamperme-15d4e.appspot.com",
    messagingSenderId: "881083284025"
};
firebase.initializeApp(config);


var index = require('./routes/index');
var users = require('./routes/user/user');
var api = require('./routes/API');
var scheduling = require('./routes/user/scheduling');
var availability = require('./routes/user/availability');
var history = require('./routes/user/history');

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use(function (req, res, next) {
    req.session.cookie.maxAge = 180 * 60 * 1000; // 3 hours
    next();
});

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});



app.use('/', index);
app.use('/user',users);
app.use('/API', api);
app.use('/user/availability',availability);
app.use('/user/scheduling',scheduling);
app.use('/user/history',history);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

firebase.auth().onAuthStateChanged(function (user) {
    if(user){
        getUser(user.uid,function (code, done) {
            if(code != null){
                if(code == 1){
                    app.locals.babysitter = true;
                } else if(code == 2){
                    app.locals.client = true;
                }
            }
        });
    }

})


function getClient(uid, callback) {
    var query = util.format(CLIENTS + " where UID = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err, null)
        }
        if (rows.length > 0) {
            callback(null, rows[0]);
        } else {
            callback("no user found",null);
        }
    });
}

function getBabysitter(uid, callback) {
    var query = util.format(BABYSITTER + " where UID = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err, null)
        }
        if (rows.length > 0) {
            callback(null, rows[0]);
        } else {
            callback("no user found",null);
        }
    });
}


function getUser(uid,callback) {
    var query = util.format(USER, uid);
    connection.query(query, function (err, data) {
        if (err) {
        } else {
            if (data[0].type == 1) {
                getBabysitter(uid, function (err, done) {
                    if (err) {
                        callback(null,err);
                    } else {
                        callback(1,done);
                    }
                });
            } else {
                getClient(uid, function (err, done) {
                    if (err) {
                        callback(null,err);
                    } else {
                        callback(2,done);
                    }
                });
            }
        }
    })
}


console.log("Server Started");
module.exports = app;
