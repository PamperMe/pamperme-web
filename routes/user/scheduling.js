var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4"
}, 'request');


router.get('/', isLoggedIn, function (req, res) {
    res.render('user/scheduling');
});

router.post('/', isLoggedIn, function (req, res) {
    var dayMonth = req.body.dayMonth.toString();
    var startHour = req.body.startHour.valueOf().toString();
    var duration = req.body.duration;
    console.log(dayMonth);
    console.log(startHour);
    console.log(duration);
    var query = "INSERT INTO schedule(id_babysitter,date,start_hour,end_hour) VALUES ("
        + req.app.locals.user.id + ",'" + dayMonth + "'," + startHour + "," + duration + ")";
    connection.query(query,function (err, done) {
        if(err){
            res.send(err);
        } else {
            if(done.affectedRows < 1){
                res.send("erro");
            } else {
                res.redirect('/user/scheduling');
            }
        }
    });

    //var scheduleQuery = "SELECT * from schedule where day_month = 'dayMonth' and
    // start_hour = 'start_hour' and duration = 'duration'  ";

});

function isLoggedIn(req,res,next) {
    if(req.app.locals.user){
        return next();
    }
    res.redirect('/login');
}
module.exports = router;