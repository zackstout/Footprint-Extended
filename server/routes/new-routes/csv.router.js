
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../../modules/pool.js');

router.post('/trial_transition', function (req, res) {
  // Oh duh, we don't wanna check whether user is authenticated here!
    console.log("BODY: ", req.body);
    var data = req.body;
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var queryText = 'INSERT INTO "trial_transitions" (size, hours, load, "costPerLiter", overspec, "dayPower", budget) VALUES ($1, $2, $3, $4, $5, $6, $7);';

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

module.exports = router;
