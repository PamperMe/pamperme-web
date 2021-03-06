var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');

var future_visits_confirmed = "SELECT b.name as babysitter_name, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date > NOW() and id_babysitter = %s and v.confirmation = 1";

var future_visits_to_confirm = "SELECT v.id_visits, b.name as babysitter_name, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date > NOW() and id_babysitter = %s and v.confirmation = 0";

const connection = require('../../models/Connect');

router.get('/', isLoggedIn, function (req, res) {
    connection.query(util.format(future_visits_confirmed,req.app.locals.user.id), function (err, alreadyConfirmed) {
        if (err) {
            res.render('user/schedules');
        } else {
            var confirmed = [];
            for(var i = 0; i < alreadyConfirmed.length; i++){
                confirmed[i] = new Visit(alreadyConfirmed[i]);
            }
            connection.query(util.format(future_visits_to_confirm,req.app.locals.user.id), function (err, toConfirm) {
                if (err) {
                    res.render('user/schedules');
                } else {
                    var to_confirm = [];
                    for(var i = 0; i < toConfirm.length; i++){
                        to_confirm[i] = new Visit(toConfirm[i]);
                    }
                    if(to_confirm.length > 0){
                        req.app.locals.badgeCounter = to_confirm.length;
                    }
                    res.render('user/schedules', {confirmed: confirmed, toConfirm:to_confirm});
                }
            });
        }
    });
});

router.post('/accept', isLoggedIn, function (req,res) {
    if(req.body.visits_id){
        var query = util.format("UPDATE visits SET confirmation = 1 WHERE id_visits ='%s';",req.body.visits_id);
        connection.query(query,function (err, result) {
            if(err){
                res.redirect("/user/schedules");
            } else {
                if(result.affectedRows > 0){
                    res.redirect("/user/schedules");
                } else {
                    res.redirect("/user/schedules");
                }
            }
        })
    }
});

router.post('/decline', isLoggedIn, function (req,res) {
    if(req.body.visits_id){
        var query = util.format("UPDATE visits SET confirmation = 2 WHERE id_visits ='%s';",req.body.visits_id);
        connection.query(query,function (err, result) {
            if(err){
                res.redirect("/user/schedules");
            } else {
                if(result.affectedRows > 0){
                    res.redirect("/user/schedules");
                } else {
                    res.redirect("/user/schedules");
                }
            }
        })
    }
});


function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
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