var express = require('express');
var router = express.Router();
var util = require('util');
var mysql = require('mysql');

var connection = mysql.createPool({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4",
    limit:25
})



const CLIENTS = "SELECT * from clients";
const BABYSITTER = "SELECT * from babysitter";
const CRITICS = "SELECT * from critics";
const APPOINTMENTS = "SELECT * from appointments";
const VISITS = "SELECT * from visits";
const SCHEDULES = "SELECT * from schedule";

const USER = "SELECT * from user_type where uid = '%s'";

function getClient(uid,callback) {
    var query = util.format(CLIENTS + " where uid = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
            if (err) {
                callback(err,null);
            }
            else {
                callback(null,rows);
            }
    });
}

function getBabysitter(uid,callback) {
    var query = util.format(BABYSITTER + " where uid = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err,null);
        }
        else {
            callback(null,rows);
        }
    });
}

router.get('/USER/:UID', function (req, res) {
    var client_uid = req.params.UID;
    var query = util.format(USER,client_uid);
    connection.query(query, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            console.log(data);
            if(data[0].type == 1){
                getBabysitter(client_uid,function (err, done) {
                    if(err){
                        res.send(err);
                    } else {
                        res.send(done);
                    }
                });
            } else {
                getClient(client_uid,function (err, done) {
                    if(err){
                        res.send(err);
                    } else {
                        res.send(done);
                    }
                });
            }
        }
    })
});

router.get('/CLIENTS', function (req, res) {
    connection.query(CLIENTS, function (err, rows, fields) {

        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(rows);
        }
    });

});

router.get('/BABYSITTER', function (req, res) {

    connection.query(BABYSITTER, function (err, rows, fields) {
        console.log(err);

        if (err) {
            res.send(err)
        }
        else {
            res.send(rows);
        }
    });

});

router.get('/CRITICS', function (req, res) {

    connection.query(CRITICS, function (err, rows, fields) {
        console.log(err);

        if (err) {
            res.send(err)
        }
        else {
            res.send(rows);
        }
    });
});

router.get('/APPOINTMENTS', function (req, res) {

    connection.query(APPOINTMENTS, function (err, rows, fields) {
        console.log(err);

        if (err) {
            res.send(err)
        }
        else {
            res.send(rows);
        }
    });
});

router.get('/VISITS', function (req, res) {

    connection.query(VISITS, function (err, rows, fields) {
        console.log(err);

        if (err) {
            res.send(err)
        }
        else {
            res.send(rows);
        }
    });
});

router.get('/SCHEDULE', function (req, res) {

    connection.query(SCHEDULES, function (err, rows, fields) {
        console.log(err);

        if (err) {
            res.send(err)
        }
        else {
            res.send(rows);
        }
    });
});

module.exports = router;