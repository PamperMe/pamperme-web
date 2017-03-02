const express = require('express');
const router = express.Router();
const util = require('util');

const query_sitters = "SELECT distinct * FROM babysitter where uid = '%s'";

const query_availability = "select date, start_hour, end_hour, babysitter.id from schedule " +
    "inner join babysitter on babysitter.id = schedule.id_babysitter where babysitter.uid = '%s' and date > now() order by date limit %s, %s";

const query_page_counter = "select count(*) entries from schedule " +
    "inner join babysitter on babysitter.id = schedule.id_babysitter where babysitter.uid = '%s'"

const connection = require('../models/Connect');

router.get('/:uid/:page',isLoggedIn, function (req, res) {
    var data,uid;
    connection.query(util.format(query_sitters, req.params.uid), function (err, done) {
        if (err) {
            res.send(err);
        } else {
            if (done.length > 0) {
                data = new Sitter(done[0],req.params.uid);
                uid = req.params.uid;
                var lowLimit, highLimit;
                if (req.params.page == 1) {
                    lowLimit = 0;
                    highLimit = 9;
                }
                if (req.params.page > 1) {
                    lowLimit = (req.params.page-1) * 10;
                    highLimit = lowLimit + 9;
                }
                var numberPages,entries,array;
                array = [];
                connection.query(util.format(query_page_counter, req.params.uid), function (err, d) {
                    if (err) {
                    }
                    if (!err) {
                        entries = d[0].entries;
                        numberPages = Math.floor(entries/10);
                        if(entries%10 != 0){
                            numberPages++;
                        }
                        for(var i = 0; i < numberPages; i++){
                            array[i] = i+1;
                        }
                        connection.query(util.format(query_availability, req.params.uid, lowLimit, highLimit), function (err, result) {
                            if (!err) {
                                var availability = [];
                                for (var i = 0; i < result.length; i++) {
                                    availability[i] = new Availability(result[i]);
                                }
                                res.render('user/babysitter_profile', {data: data, availability: availability, numberPages:array});
                            }
                        });
                    }
                });

            } else {
                res.redirect('/');
            }
        }
    });
});

router.post('/:uid/:id/confirm', isLoggedIn, function (req, res) {
    var query = "Select distinct * from babysitter where id = " + req.params.id;
    connection.query(query,function (err, done) {
        if(!err){
            res.render("user/scheduleForm", {data: done, date:req.body.date, start_hour:req.body.start_hour, end_hour: req.body.end_hour});
        }
    });
});

router.post('/:uid/:id/confirmed', isLoggedIn, function (req, res) {
    var userID = req.app.locals.user.id;
    var id_client, id_babysitter, date, start_hour, duration;
    id_client = req.app.locals.user.id;
    id_babysitter = req.params.id;
    date = req.body.date;
    start_hour = req.body.start_hour;
    duration = req.body.duration;
    var query_schedule = "Insert into visits (id_client, id_babysitter, date, start_hour, duration, confirmation) " +
        "values (%s, %s, '%s', %s, %s, 0)";
    var query = util.format(query_schedule, id_client, id_babysitter, date, start_hour, duration);
    connection.query(query,function (err, done) {
        if(err){
            res.send(err);
        } else {
            if(done.affectedRows == 1){
                res.redirect("/user/profile");
            }
        }
    });
});



function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}



function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function Sitter(data,uid){
    this.id = data.id;
    this.age = getAge(data.birthday);
    this.name = data.name;
    this.location = data.location;
    this.evaluation = data.evaluation;
    this.phone = data.phone;
    this.price = data.price;
    this.uid = uid;
}

function Availability(data) {
    var formattedDate = util.format("%s/%s/%s", data.date.getDate(), data.date.getMonth() + 1, data.date.getFullYear());
    this.date = formattedDate;
    this.start_hour = data.start_hour;
    this.end_hour = data.end_hour;
}

module.exports = router;