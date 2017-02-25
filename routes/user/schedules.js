var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');

var future_visits = "SELECT * FROM visits WHERE date >= NOW()";

const connection = require('../../models/Connect');


router.get('/', isLoggedIn, function (req, res) {
    connection.query(future_visits, function (err, done) {
        if (err) {
            res.render('user/scheduling');
        } else {
            res.render('user/scheduling', {data: done});
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