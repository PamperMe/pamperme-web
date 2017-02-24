var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var mysql = require('mysql');

var past_visits = "SELECT * FROM visits WHERE date < NOW()";

var connection = mysql.createPool({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4",
    limit:5
});

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