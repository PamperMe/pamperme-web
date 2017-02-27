const express = require('express');
const router = express.Router();
const util = require('util');

const query_sitters = "SELECT distinct uid, name FROM babysitter";

const search_query = "SELECT distinct b.uid,b.name from babysitter b inner join schedule s on s.id_babysitter = b.id %s";

const connection = require('../../models/Connect');


router.get('/', function (req, res) {
    req.app.locals.searchName = "";
    req.app.locals.searchLocation = "";
    req.app.locals.searchPrice = "";
    req.app.locals.searchDate = "";
    req.app.locals.searchEvaluation = "";
    connection.query(query_sitters, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.render('user/scheduling', {data: result});
        }
    });
});


router.post('/', function (req, res) {
    var name, location, priceMin, priceMax, date, evaluation, query, value;
    var combined = ' where ';
    if (req.body.name != "") {
        name = util.format("b.name like '%s' and ", "%" + req.body.name + "%");
        combined = combined.concat(name);
    }
    if (req.body.location != "") {
        location = util.format("b.location like '%s' and ", req.body.location);
        combined = combined.concat(location);
    }
    if (req.body.priceMin != "") {
        priceMin = util.format("b.price >= '%s' and ", req.body.priceMin);
        combined = combined.concat(priceMin);
    }
    if (req.body.priceMax != "") {
        priceMax = util.format("b.price <= '%s' and ", req.body.priceMax);
        combined = combined.concat(priceMax);
    }
    if (req.body.date != "") {
        date = util.format("s.date = '%s' and ", req.body.date);
        combined = combined.concat(date);
    }
    if (req.body.evaluation != "" || req.app.locals.searchEvaluation != "") {
        if (req.body.evaluation != "") {
            value = req.body.evaluation;
        } else {
            value = req.app.locals.searchEvaluation;
        }
        evaluation = util.format("b.evaluation >= %s and ", value);
        combined = combined.concat(evaluation);
    }
    req.app.locals.searchName = req.body.name;
    req.app.locals.searchLocation = req.body.location;
    req.app.locals.searchPriceMin = req.body.priceMin;
    req.app.locals.searchPriceMax = req.body.priceMax;
    req.app.locals.searchDate = req.body.date;
    if (value != undefined) {
        req.app.locals.searchEvaluation = value;
    }

    if (combined != " where ") {
        combined = combined.substring(0, combined.length - 5);
        query = util.format(search_query, combined);
    } else {
        query = query_sitters;
    }
    connection.query(query, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.render('user/scheduling', {data: result});
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.app.locals.user) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;