var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');

var past_visits = "SELECT b.name as babysitter_name, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date <= NOW() and id_%s = %s";

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
            var visits= [];
            for(var i = 0; i < done.length; i++){
                visits[i] = new Visit(done[i]);
            }
            res.render('user/history', {data:visits});
        }

    });

});


function isLoggedIn(req,res,next) {
    if(req.app.locals.user){
        return next();
    }
    res.redirect('/login');
}


function Visit(data){
    var formattedDate = util.format("%s/%s/%s", data.date.getDate(), data.date.getMonth() + 1, data.date.getFullYear());
    this.babysitter_name = data.babysitter_name;
    this.client_name = data.client_name;
    this.price = data.price;
    this.date = formattedDate;
    this.start_hour = data.start_hour;
    this.duration = data.duration;
    this.evaluation = data.evaluation;
    this.address = data.address;
    this.id = data.id_visits;
}


module.exports = router;