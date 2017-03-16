var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');
var connection = require('../../models/Connect');

router.get('/', function (req, res) {
    res.render('user/first_login');
});


router.post('/babysitter', function (req, res) {
    var name, phone, location, price, birthday, description, uid, email, photo_url;
    name = req.body.name;
    phone = req.body.phone;
    location = req.body.location;
    price = req.body.price;
    birthday = req.body.birthday;
    description = req.body.description;
    uid = firebase.auth().currentUser.uid;
    email = firebase.auth().currentUser.email;

    if(firebase.auth().currentUser.providerData[0].providerId != null &&
        firebase.auth().currentUser.providerData[0].providerId == "facebook.com"
    ){
        var facebookUserId = firebase.auth().currentUser.providerData[0].uid;
        photo_url = "'https://graph.facebook.com/" + facebookUserId + "/picture?height=250'"
    } else {
        photo_url = NULL;
    }

    var query = util.format("Insert into babysitter (uid,email,name,birthday,location,price,description,phone, photo_url) values ('%s'," +
        " '%s', '%s', '%s','%s','%s', '%s', '%s, %s')", uid, email, name, birthday, location, price, description, phone, photo_url);

    connection.query(query, function (err, done) {
        if (err) {
            res.send(err);
        } else {
            if (done.affectedRows == 1) {
                var queryClient = util.format("select distinct * from babysitter where uid = '%s'", uid);
                connection.query(queryClient, function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (result.length > 0) {
                            var babysitter = new Babysitter(result[0]);
                            req.app.locals.babysitter = true;
                            req.app.locals.user = babysitter;
                            res.redirect('/user/profile/1');
                        }
                    }
                });
            } else {
                res.send("erro");
            }
        }
    });
});

router.post('/client', function (req, res) {
    var name, phone, address, uid, email, photo_url;
    name = req.body.name;
    phone = req.body.phone;
    address = req.body.address;
    uid = firebase.auth().currentUser.uid;
    email = firebase.auth().currentUser.email;

    if(firebase.auth().currentUser.providerData[0].providerId != null &&
        firebase.auth().currentUser.providerData[0].providerId == "facebook.com"
    ){
        var facebookUserId = firebase.auth().currentUser.providerData[0].uid;
        photo_url = "'https://graph.facebook.com/" + facebookUserId + "/picture?height=250'"
    } else {
        photo_url = NULL;
    }

    var query = util.format("Insert into clients (uid, name, address, email, phone, photo_url) values ('%s', '%s', '%s', '%s','%s', %s)"
        , uid, name, address, email, phone, photo_url);
    connection.query(query, function (err, done) {
        if (err) {
            res.send(err);
        } else {
            if (done.affectedRows == 1) {
                var queryClient = util.format("select distinct * from clients where uid = '%s'", uid);
                connection.query(queryClient,function (err, result) {
                    if(err){
                        res.send(err);
                    } else {
                        req.app.locals.client = true;
                        req.app.locals.user = result[0];
                        res.redirect('/user/profile/1');
                    }
                });
            } else {
                res.send("erro");
            }
        }
    })
});


function Babysitter(data) {
    var formattedDate = util.format("%s/%s/%s", data.birthday.getDate(), data.birthday.getMonth() + 1, data.birthday.getFullYear());
    this.birthday = formattedDate;
    this.description = data.description;
    this.email = data.email;
    this.evaluation = data.evaluation;
    this.id = data.id;
    this.location = data.location;
    this.name = data.name;
    this.phone = data.phone;
    this.photo_url = data.photo_url;
    this.price = data.price;
    this.uid = data.uid;
    this.age = getAge(data.birthday);
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

module.exports = router;