
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../../modules/pool.js');


// NOTE: Will have to add DailyLiters to the tables, to reflect our shitty workaround. (actually would have to do it no matter what..)


// Post user's trial transition data to DB:
router.post('/trial_transition', function (req, res) {
  // Oh duh, we don't wanna check whether user is authenticated here!
  console.log("BODY: ", req.body);
  var data = req.body;
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "trial_transitions" (size, hours, load, "costPerLiter", overspec, "dayPower", budget) VALUES ($1, $2, $3, $4, $5, $6, $7);'; // remember, need quote marks for case-sensitive col names.

      db.query(queryText, [data.size, data.hours, data.load, data.cost, data.overspec, data.dayPower, data.budget], function (errorMakingQuery, result) {
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

// Post authenticated user's data to DB:
router.post('/user_transition', function (req, res) {
  // Oh duh, we don't wanna check whether user is authenticated here!
  console.log("BODY: ", req.body);
  var data = req.body;
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "user_transitions" (size, hours, load, "costPerLiter", overspec, "dayPower", budget, "userId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8);'; // remember, need quote marks for case-sensitive col names.

      db.query(queryText, [data.size, data.hours, data.load, data.cost, data.overspec, data.dayPower, data.budget, parseInt(data.userId)], function (errorMakingQuery, result) {
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

module.exports = router;
