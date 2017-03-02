var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');

var future_visits_confirmed = "SELECT b.name as babysitter_name, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date >= NOW() and id_babysitter = %s and confirmation = 1";


var future_visits_to_confirm = "SELECT b.name as babysitter_name, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date >= NOW() and id_babysitter = %s";

const connection = require('../../models/Connect');


router.get('/', isLoggedIn, function (req, res) {
    connection.query(util.format(future_visits,req.app.locals.user.id), function (err, done) {
        if (err) {
            res.render('user/schedules');
        } else {
            res.render('user/schedules', {data: done});
        }
    });
});

router.post('/', function (req,res) {

});


function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;