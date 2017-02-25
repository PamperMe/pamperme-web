const express = require('express');
const router = express.Router();
const util = require('util');


var getAvailability = "SELECT * FROM schedule where id_babysitter = %s";

const connection = require('../../models/Connect');


router.get('/',isLoggedIn, function (req, res) {
        var query = util.format(getAvailability, req.app.locals.user.id);
        connection.query(query,function (err, done) {
            if(err){
                res.send(err);
            } else{
                res.render('user/availability',{schedule:done});
            }
        });
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