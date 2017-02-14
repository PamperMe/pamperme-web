var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/', function (req, res) {
    res.render('user/scheduling');
});

router.post('/schedule', function (req, res) {

});
module.exports = router;