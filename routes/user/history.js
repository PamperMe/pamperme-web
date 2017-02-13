var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/', function (req, res) {
    res.render('user/history');
});

module.exports = router;