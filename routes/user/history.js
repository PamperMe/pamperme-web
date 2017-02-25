var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var past_visits = "SELECT * FROM visits WHERE date < NOW()";

const connection = require('../../models/Connect');

router.get('/', isLoggedIn, function (req, res) {
    connection.query(past_visits,function (err, done) {
        if(err){
            res.send(err);
        } else {
            if(req.app.locals.client){
                res.render('user/history',{data:done});
            } else if(req.app.locals.babysitter){
                res.render('user/history',{data:done});
            }
        }

    });

});


function isLoggedIn(req,res,next) {
    if(req.app.locals.user){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;