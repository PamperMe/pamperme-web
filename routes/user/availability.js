var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var app = express();

router.get('/', function (req, res) {
    console.log(req.app.locals.babysitter);
    res.render('user/availability');
});

module.exports = router;