var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/', isLoggedIn, function (req, res) {
    if(req.app.locals.client){
        res.render('user/history',{data:"client"});
    } else if(req.app.locals.babysitter){
        res.render('user/history',{data:"babysitter"});
    }
});


function isLoggedIn(req,res,next) {
    if(req.app.locals.user){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;