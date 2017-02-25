const express = require('express');
const router = express.Router();
const util = require('util');

const query_sitters = "SELECT * FROM babysitter";

const connection = require('../../models/Connect');


router.get('/', isLoggedIn, function (req, res) {
    connection.query(query_sitters, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.render('user/scheduling', {data: result});
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