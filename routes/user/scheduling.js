var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var mysql = require('mysql');

var query_sitters = "SELECT * FROM babysitter";

var future_visits = "SELECT * FROM visits";

var connection = mysql.createConnection({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4"
}, 'request');


router.get('/', isLoggedIn, function (req, res) {
    if(req.app.locals.client){
        connection.query(query_sitters,function (err,done) {
            if(err){
                babysitters = null;
                res.render('user/scheduling');
            } else {
                res.render('user/scheduling', {babysitters:done});
            }
        });
    } else if(req.app.locals.babysitter){
        connection.query(future_visits,function (err,done) {
            if(err){
                babysitters = null;
                res.render('user/scheduling');
            } else {
                res.render('user/scheduling', {visits:done});
            }
        });
    }

});

router.get('/babysitter/:uid', function (req, res) {

        res.render('user/profile');


});


function isLoggedIn(req,res,next) {
    if(req.app.locals.user){
        return next();
    }
    res.redirect('/login');
}
module.exports = router;