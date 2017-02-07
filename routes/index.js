var express = require('express');
var router = express.Router();

var firebase = require('firebase');
// var firebase = require('firebase');
//

var loggedUser;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loggedUser = user;
        var name, email, photoUrl, uid, emailVerified;
        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                             // this value to authenticate with your backend server, if
                             // you have one. Use User.getToken() instead.
        }
    } else {
        loggedUser = null;
    }
});


router.get('/', function (req, res) {
    console.log(loggedUser);
    var client = false;
    var babysitter = false;
    if (loggedUser != null) {
        client = true;
    }
    res.render('index', {title: "PamperMe", babySitter: babysitter, client: client})
});


router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    console.log("email:" + req.body.email);
    console.log("pass:" + req.body.password);
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function (data) {
        res.redirect('/');
    }).catch(function (error) {
        res.send(error);
    })

});

router.post('/login', function (req, res) {
    console.log("email:" + req.body.email);
    console.log("pass:" + req.body.password);
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function (data) {
        res.redirect('/');
    }).catch(function (error) {
        res.send(error);
    });
});

router.get('/google', function (req, res) {
    function onSignIn(googleUser) {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential).catch(function(error) {
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

module.exports = router;
