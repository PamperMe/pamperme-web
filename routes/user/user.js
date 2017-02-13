var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/logout', function (req, res) {
    firebase.auth().signOut().then(function () {
            res.redirect('/');
        }
    ).catch(function (error) {
        res.send(error);
    })
});

router.get('/', function (req, res) {
    res.render('user/profile',{name:"test"});
});

module.exports = router;
