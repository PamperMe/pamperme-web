var express = require('express');
var router = express.Router();
var firebase = require('firebase');


router.get('/', function (req, res) {
    res.render('user/scheduling');
});

router.post('/scheduling', function (req, res) {
    var dayMonth = req.body.dayMonth.toString();
    var startHour = req.body.startHour.valueOf().toString();
    var duration = req.body.duration;
    req.body.result.innerHTML(dayMonth);
    console.log(dayMonth);
    console.log(startHour);
    console.log(duration);

    //var scheduleQuery = "SELECT * from schedule where day_month = 'dayMonth' and
    // start_hour = 'start_hour' and duration = 'duration'  ";

});
module.exports = router;