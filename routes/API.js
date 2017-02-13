var express = require('express');
var router = express.Router();
var util = require('util');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4"
}, 'request');

connection.connect();

const CLIENTS = "SELECT * from clients";
const BABYSITTER = "SELECT * from babysitterIsLoggedIn";
const CRITICS = "SELECT * from critics";
const APPOINTMENTS = "SELECT * from appointments";
const VISITS = "SELECT * from visits";
const SCHEDULES = "SELECT * from schedule";

const USER = "SELECT * from clienttype where UID = '%s'";

function getClient(uid,callback) {
    var query = util.format(CLIENTS + " where UID = '%s'", uid);
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
    var query = util.format(BABYSITTER + " where UID = '%s'", uid);
    connection.query(query, function (err, rows, fields) {
        if (err) {
            callback(err,null);
        }
        else {
            callback(null,rows);
        }
    });
}

router.get('/user/:UID', function (req, res) {
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

router.get('/clients', function (req, res) {
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

router.get('/babysitterIsLoggedIn', function (req, res) {

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

router.get('/critics', function (req, res) {

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

router.get('/appointments', function (req, res) {

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

router.get('/visits', function (req, res) {

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

router.get('/schedule', function (req, res) {

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