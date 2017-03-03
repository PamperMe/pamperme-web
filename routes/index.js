var express = require('express');
var router = express.Router();
var util = require('util');
var session = require('express-session');
var User = require('../models/User');
var firebase = require('firebase');


var connection = require('../models/Connect');

var babysitter = false;
const CLIENTS = "SELECT * from clients";
const BABYSITTER = "SELECT * from babysitter";
const USER = "SELECT * from user_type where uid = '%s'";
const counter_visits = "SELECT count(*) as counter from visits where id_babysitter = %s and confirmation = 0 and date > now()";


router.get('/', function (req, res) {
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
        res.redirect('/user/firstLogin');
    }).catch(function (error) {
        res.send(error);
    })

});

router.post('/login', function (req, res) {
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function (data) {
        if (data != null) {
            getUser(data.uid, function (code, result, counter) {
                if (code == 1) {
                    var babysitter = new Babysitter(result);
                    req.app.locals.babysitter = true;
                    req.app.locals.user = babysitter;
                    req.app.locals.badgeCounter = counter;
                    req.app.locals.userAge = getAge(result.birthday);
                    res.redirect('/user/profile');
                } else if (code == 2) {
                    req.app.locals.client = true;
                    req.app.locals.user = result;
                    res.redirect('/user/profile');
                } else if (code == 3) {
                    //TODO First time login
                    req.app.locals.email = data.email;
                    res.redirect('/user/firstLogin');
                }
            })
        }
    }).catch(function (error) {
        if (error.code == "auth/user-not-found") {
            res.render("login", {
                hasErrors: true,
                error: 'O Utilizador errado. Se não tem conta, registe-se <a href="/register">aqui</a>'
            });
        } else if (error.code == "auth/wrong-password") {
            res.render("login", {hasErrors: true, error: "Palavra-passe errada. Por favor tente de novo."});
        }
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


function getUser(uid, callback) {
    var query = util.format(USER, uid);
    connection.query(query, function (err, data) {
        if (err) {
        } else {
            if (data.length > 0) {
                if (data[0].type == 1) {
                    getBabysitter(uid, function (err, done) {
                        if (err) {
                            callback(null, err);
                        } else {
                            connection.query(util.format(counter_visits, done.id), function (err, result) {
                                if (err) {
                                    callback(1, done, null);
                                } else {
                                    callback(1, done, result[0].counter);
                                }
                            });
                        }
                    });
                } else {
                    getClient(uid, function (err, done) {
                        if (err) {
                            callback(null, err, null);
                        } else {
                            callback(2, done, null);
                        }
                    });
                }
            }
            else {
                callback(3, null, null);
            }
        }
    })
}

function getClient(uid, callback) {
    var query = util.format(CLIENTS + " where uid = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err, null)
        }
        if (rows != undefined) {
            if (rows.length > 0) {
                callback(null, rows[0]);
            } else {
                callback("no user found", null);
            }
        }
    });
}

function getBabysitter(uid, callback) {
    var query = util.format(BABYSITTER + " where uid = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err, null)
        }
        if (rows != undefined) {
            if (rows.length > 0) {
                callback(null, rows[0]);
            } else {
                callback("no user found", null);
            }
        }
    });
}


function Babysitter(data) {
    this.birthdayRaw = data.birthday;
    var formattedDate = util.format("%s/%s/%s", data.birthday.getDate(), data.birthday.getMonth() + 1, data.birthday.getFullYear());
    this.birthday = formattedDate;
    this.description = data.description;
    this.email = data.email;
    this.evaluation = data.evaluation;
    this.id = data.id;
    this.location = data.location;
    this.name = data.name;
    this.phone = data.phone;
    this.photo_url = data.photo_url;
    this.price = data.price;
    this.uid = data.uid;
    this.age = getAge(data.birthday);
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
module.exports = router;