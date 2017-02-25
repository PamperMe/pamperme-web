const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const util = require('util');

const query_sitters = "SELECT * FROM babysitter";

const connection = mysql.createPool({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4",
    limit: 5
});


router.get('/', isLoggedIn, function (req, res) {
    connection.query(query_sitters, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.render('user/scheduling', {data: result});
        }
    });
});

router.get('/babysitter/:uid', function (req, res) {
    res.render('user/profile');

});

function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;