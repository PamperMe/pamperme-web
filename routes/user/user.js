var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/logout', function (req, res) {
    firebase.auth().signOut().then(function () {
            res.redirect('/');
            res.locals.session = null;
            req.app.locals.babysitter = false;
            req.app.locals.client = false;
            req.app.locals.user = null;
            express.session = null;
        }
    ).catch(function (error) {
        res.send(error);
    })
});

router.get('/', isLoggedIn, function (req, res) {
    res.render('user/profile',{name:"test"});
});

function isLoggedIn(req,res,next) {
    if(req.app.locals.user){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
