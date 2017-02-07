var express = require('express');
var router = express.Router();

var firebase = require('firebase');
// var firebase = require('firebase');
//

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBP1B8MFHnGkg5VRoezvj3ozEg_yEDPZ84",
    authDomain: "pamperme-15d4e.firebaseapp.com",
    databaseURL: "https://pamperme-15d4e.firebaseio.com",
    storageBucket: "pamperme-15d4e.appspot.com",
    messagingSenderId: "881083284025"
};
firebase.initializeApp(config);



/* GET home page. */
router.get('/', function (req, res, next) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
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
            res.send(email);
        } else {
            res.send("nada");
        }
    });
});

router.get('/login', function (req,res) {
    res.render('index');
});

router.post('/register',function (req, res) {
    console.log("email:" + req.body.email);
    console.log("pass:" + req.body.password);

});

router.post('/login', function (req, res) {
    console.log("email:" + req.body.email);
    console.log("pass:" + req.body.password);
    firebase.auth().signInWithEmailAndPassword(req.body.email,req.body.password).then(function (data) {
        res.redirect('/');
    }).catch(function (error) {
        res.send(error);
    });
});

module.exports = router;
