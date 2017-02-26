var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');

var future_visits = "SELECT * FROM visits WHERE date >= NOW() and id_babysitter = %s";

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


function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;