var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var firebase = require('firebase');


var update_photo_url_query = "UPDATE %s SET photo_url = '%s' WHERE uid = '%s'";

var future_visits_confirmed = "SELECT b.name as babysitter_name, confirmation, c.name as client_name, (v.duration*b.price) as price," +
    " v.date, v.start_hour, v.duration, v.evaluation, c.address FROM visits v inner join clients c on v.id_client = c.id" +
    " inner join babysitter b on b.id = v.id_babysitter WHERE date > NOW() and id_client = %s";


var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});

var gcloud = require('google-cloud');
var gcs = gcloud.storage({
    projectId: 'pamperme-2ca1f',
    keyFilename: 'key.json'
});

const connection = require('../../models/Connect');

var bucket = gcs.bucket('pamperme-15d4e.appspot.com');


router.get('/logout', function (req, res) {
    firebase.auth().signOut().then(function () {
            res.redirect('/');
            res.locals.session = null;
            req.app.locals.babysitter = false;
            req.app.locals.client = false;
            req.app.locals.user = null;
            req.app.locals.email = null;
            express.session = null;
        }
    ).catch(function (error) {
        res.send(error);
    })
});


router.post('/fileupload', upload.any(), function (req, res) {
    return bucket.upload(req.files[0].path).then((results) => {
        var photo_url = "https://storage.googleapis.com/pamperme-15d4e.appspot.com/" + results[0].name;
            firebase.auth().currentUser.updateProfile({
                photoURL: photo_url
            });
            if(req.app.locals.babysitter){
                var query = util.format(update_photo_url_query,"babysitter",photo_url,req.app.locals.user.uid);
                connection.query(query,function (err, done) {
                    if(err){
                        res.send(err);
                    } else {
                        if(done.affectedRows == 1){
                            req.app.locals.user.photo_url = photo_url;
                        }
                    }
                });
            } else {
                var query = util.format(update_photo_url_query,"clients",photo_url,req.app.locals.user.uid);
                connection.query(query,function (err, done) {
                    if(err){
                        res.send(err);
                    } else {
                        if(done.affectedRows == 1){
                            req.app.locals.user.photo_url = photo_url;
                        }
                    }
                });
            }
            fs.unlink(req.files[0].path,function (err) {
                //TODO remove callback and put null to test if works
                console.log(err);
            });
            res.redirect("/user/profile");
        });
});

router.get('/profile', isLoggedIn, function (req, res) {
    if(req.app.locals.babysitter){
        var query = util.format("SELECT distinct count(*) as counter from visits where id_babysitter = %s and confirmation = 0 and date > now()"
            ,req.app.locals.user.id);
        connection.query(query,function (err, result) {
            if(err){
                req.app.locals.badgeCounter = undefined;
                res.render('user/profile');
            } else {
                if(result[0].counter > 0){
                    req.app.locals.badgeCounter = result[0].counter;
                    res.render('user/profile');
                } else {
                    req.app.locals.badgeCounter = undefined;
                    res.render('user/profile');
                }
            }

        })
    } else {
        connection.query(util.format(future_visits_confirmed,req.app.locals.user.id),function (err, result) {
           if(err){
               res.render("user/profile");
           } else {
               var visits = [];
               for(var i = 0; i < result.length; i++){
                   visits[i] = new Visit(result[i])
               }
               res.render("user/profile", {scheduledVisits:visits});
           }
        });

    }

});

router.get('/profile/edit',isLoggedIn,function (req, res) {
    res.render('user/edit_profile');
});

router.post('/profile/edit',isLoggedIn,function (req, res) {
    var query;
    var description = req.body.description;
    description = description.replace(/\r\n/gi,'<br>');
    if(req.app.locals.babysitter){
        query = util.format("UPDATE babysitter set name = '%s' , birthday =  '%s' , location = '%s', price = '%s' , phone = '%s' , description = '%s' where uid = '%s' "
            ,req.body.name , req.body.birthday, req.body.location, req.body.price, req.body.phone, description, req.app.locals.user.uid);

    } else {
        query = util.format("UPDATE clients set name = '%s' , address =  '%s' , phone = '%s' where uid = '%s' "
            ,req.body.name, req.body.address, req.body.phone, req.app.locals.user.uid);

    }
    connection.query(query, function (err, done) {
        if(err){
        res.send(err);
        }else{
            if(done.affectedRows == 1){
               if(req.app.locals.babysitter) {
                   req.app.locals.user.name = req.body.name;
                   req.app.locals.user.birthday = req.body.birthday;
                   req.app.locals.user.location = req.body.location;
                   req.app.locals.user.price = req.body.price;
                   req.app.locals.user.phone = req.body.phone;
                   req.app.locals.user.description = description;
               }else{
                   req.app.locals.user.name = req.body.name;
                   req.app.locals.user.phone = req.body.phone;
                   req.app.locals.user.address = req.body.address;
               }
                res.redirect('/user/profile');
            }
        }
    });

});

function Visit(data){
    var formattedDate = util.format("%s/%s/%s", data.date.getDate(), data.date.getMonth() + 1, data.date.getFullYear());
    this.babysitter_name = data.babysitter_name;
    this.client_name = data.client_name;
    this.price = data.price;
    this.date = formattedDate;
    this.start_hour = data.start_hour;
    this.duration = data.duration;
    this.evaluation = data.evaluation;
    this.address = data.address;
    this.id = data.id_visits;
    if(data.confirmation == 0){
        this.noAnswer = true;
    } else if(data.confirmation == 1){
        this.accepted = true;
    } else {
        this.rejected = true;
    }
}

function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
