var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var util = require('util');


var session = require('express-session');

var mysqlSession = require('express-mysql-session');


var User = require('../models/User');


var myUser;
var firebase = require('firebase');

var connection = mysql.createConnection({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4"
}, 'request');

var client = false;
var babysitter = false;
const CLIENTS = "SELECT * from clients";
const BABYSITTER = "SELECT * from babysitter";
const USER = "SELECT * from clienttype where UID = '%s'";



router.get('/', function (req, res) {
    if(res.locals.login == true){

    }
    res.render('index', {title: "PamperMe"});
});


router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function (data) {
        res.redirect('/');
    }).catch(function (error) {
        res.send(error);
    })

});

router.post('/login', function (req, res) {
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function (data) {
        if(data != null){
            getUser(data.uid,function (code, result) {
                if(code == 1){
                    req.app.locals.babysitter = true;
                    req.app.locals.user = result;
                    res.redirect('/');
                } else if(code == 2){
                    req.app.locals.client = true;
                    req.app.locals.user = result;
                    res.redirect('/');
                }
            })
        }
    }).catch(function (error) {
        res.send(error);
    });
});

router.get('/google', function (req, res) {
    function onSignIn(googleUser) {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    }
});


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

module.exports = router;