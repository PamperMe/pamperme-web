var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');
var fs = require('fs');
var firebase = require('firebase');


var update_photo_url_query = "UPDATE %s SET photo_url = '%s' WHERE uid = '%s';";

var multer = require('multer');
var upload = multer({dest: 'public/uploads/'})

var gcloud = require('google-cloud');
var gcs = gcloud.storage({
    projectId: 'pamperme-2ca1f',
    keyFilename: 'key.json'
});

const connection = mysql.createPool({
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "lyq2twi3ij8swv3m",
    password: "g3bpvh44ng094s21",
    database: "gbzxf1l8o8clpop4",
    limit: 5
});


// gcs.createBucket('my-new-bucket', function (err, bucket) {
//     if (!err) {
//     }
// });

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
    return bucket.upload(req.files[0].path)
        .then((results) => {
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
                var query = util.format(update_client_photo_url_query,"clients",photo_url,req.app.locals.user.uid);
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
    res.render('user/profile');
});

function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
