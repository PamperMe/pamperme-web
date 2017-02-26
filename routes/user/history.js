var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');

var past_visits = "SELECT b.name as babysitter_name, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date < NOW() and id_%s = %s";

const connection = require('../../models/Connect');

router.get('/', isLoggedIn, function (req, res) {
    var query
    if(req.app.locals.babysitter){
        query = util.format(past_visits,"babysitter", req.app.locals.user.id);
    } else {
        query = util.format(past_visits,"client", req.app.locals.user.id);
    }
    connection.query(query,function (err, done) {
        if(err){
            res.send(err);
        } else {
            console.log(done);
            res.render('user/history', {data:done});
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