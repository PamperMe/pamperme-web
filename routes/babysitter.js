const express = require('express');
const router = express.Router();
const util = require('util');

const query_sitters = "SELECT * FROM babysitter where uid = '%s'";

const query_availability = "select date, start_hour, end_hour from schedule inner join babysitter on babysitter.id = schedule.id_babysitter where babysitter.uid = '%s' order by date"

const connection = require('../models/Connect');

router.get('/:uid', function (req, res) {
    var data;
    connection.query(util.format(query_sitters, req.params.uid), function (err, done) {
        if (err) {
            res.send(err);
        } else {
            if (done.length > 0) {
                data = done[0];
                connection.query(util.format(query_availability, req.params.uid), function (err, result) {
                    if (!err) {
                        var availability = [];
                        for (var i = 0; i < result.length; i++) {
                            availability[i] = new Availability(result[i]);
                        }
                        res.render('user/babysitter_profile', {data: data, availability: availability});

                    }
                });
            } else {
                res.redirect('/');
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


function Availability(data) {
    var formattedDate = util.format("%s/%s/%s", data.date.getDate(), data.date.getMonth() + 1, data.date.getFullYear());
    this.date = formattedDate;
    this.start_hour = data.start_hour;
    this.end_hour = data.end_hour;
}

module.exports = router;