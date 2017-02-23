var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var util = require('util');
var fs = require('fs');


var multer = require('multer');
var upload = multer({dest: 'public/uploads/'})

var gcloud = require('google-cloud');
var gcs = gcloud.storage({
    projectId: 'pamperme-2ca1f',
    keyFilename: 'key.json'
});


gcs.createBucket('my-new-bucket', function (err, bucket) {
    if (!err) {
        // "my-new-bucket" was successfully created.
    }
});

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
            const file = results[0];
            console.log(`File ${file.name} uploaded.`);
            firebase.auth().currentUser.updateProfile({
                photoURL: "https://storage.googleapis.com/pamperme-15d4e.appspot.com/" + results[0].name
            });
            fs.unlink(req.files[0].path,function (err) {
                console.log(err);
            })
            res.redirect('profile');
        });
});


router.get('/profile', isLoggedIn, function (req, res) {
    res.render('user/profile');
});

router.get('/', isLoggedIn, function (req, res) {
    res.render('user/profile', {name: "test"});
});

function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
