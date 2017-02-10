var util = require('util');
var mysql = require('mysql');
var API = require('../routes/API');

const USER = "SELECT * from clienttype where UID = '%s'";
const CLIENTS = "SELECT * from clients";
const BABYSITTER = "SELECT * from babysitter";

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "pamperme"
}, 'request');

function User(uid) {
    var query = util.format(USER,uid);
    connection.query(query, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            console.log(data);
            if(data[0].type == 1){
                getBabysitter(uid,function (err, done) {
                    if(!err){
                        this.name = done.name;
                    }
                });
            } else {
                getClient(uid,function (err, done) {
                    if(!err){
                        this.name = done.name;
                    }
                });
            }
        }
    })
}


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

module.exports = User;

