
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../../modules/pool.js');

//SUCCESSFULLY TRANSFERRED ROUTES:


// Delete a footprint:
router.delete('/delete/:id', function (req, res) {
  if (req.isAuthenticated()) {
    console.log(req.params.id);

    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var queryText = 'DELETE FROM "shipping" WHERE "footprint_id" = $1;';

        db.query(queryText, [req.params.id], function (errorMakingQuery, result) {
          if (errorMakingQuery) {
            console.log('Error with country GET', errorMakingQuery);
          } else {
            // console.log(result.rows[0]);
            queryText = 'DELETE FROM "living" WHERE "footprint_id" = $1;';
            db.query(queryText, [req.params.id], function (err, result) {
              done();
              if (err) {
                console.log(err);
              } else {

                queryText = 'DELETE FROM "travel" WHERE "footprint_id" = $1;';
                db.query(queryText, [req.params.id], function (err, result) {
                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                  } else {
                    queryText = 'DELETE FROM "footprints" WHERE "id" = $1;';
                    db.query(queryText, [req.params.id], function (err, result) {
                      done();
                      res.sendStatus(201);

                    });

                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});


//Posts a footprint to "footprints", also inserting into "shipping", "travel" and "living":
router.post('/project_submit', function (req, res) {
  if (req.isAuthenticated()) {
    var info = req.body.userInfo;
    var dataIn = req.body.dataIn;
    console.log("INFO: ", info, "DATA: ", dataIn);
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('error connecting', err);
        res.sendStatus(500);
      }
      else {
        var querytext = 'SELECT "projects"."id" as id FROM "projects" JOIN "users" ON "projects"."user_id" = "users"."id" WHERE "projects"."name" = $1 AND "users"."id" = $2;';
        db.query(querytext, [info[2].project, req.user.id], function (errorMakingQuery, result) {
          // done();
          if (errorMakingQuery) {
            console.log('Error with FP POST', errorMakingQuery);
            res.sendStatus(501);
          } else {
            console.log(result.rows[0].id);
            var mon = info[0].selectedMonth;
            var month = months.indexOf(info[0].selectedMonth) + 1;
            if (mon == 'October' || mon == 'November' || mon == 'December') {
              month = months.indexOf(info[0].selectedMonth) + 1;
            } else {
              month = '0' + month;
            }

            var per = info[1].selectedYear + '-' + month + '-01';
            queryText = 'INSERT INTO "footprints" ("period", "project_id") VALUES ($1, $2) RETURNING "id";';
            db.query(queryText, [per, result.rows[0].id], function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log(result.rows[0].id);
                queryText = 'INSERT INTO "shipping" ("air", "sea", "truck", "freight_train", "footprint_id") VALUES ($1, $2, $3, $4, $5);';

                var dat = dataIn[0];
                var fpId = result.rows[0].id;
                db.query(queryText, [dat.air, dat.sea, dat.truck, dat.train_shipping, fpId], function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    queryText = 'INSERT INTO "travel" ("plane", "car", "train", "footprint_id") VALUES ($1, $2, $3, $4);';
                    db.query(queryText, [dat.plane, dat.car, dat.train_travel, fpId], function (err, result) {
                      if (err) {
                        console.log(err);
                      } else {
                        queryText = 'INSERT INTO "living" ("hotel", "grid", "fuel", "propane", "footprint_id") VALUES ($1, $2, $3, $4, $5)';
                        db.query(queryText, [dat.hotel, dat.grid, dat.fuel, dat.propane, fpId], function (err, result) {
                          done();
                          if (err) {
                            console.log(err);
                            res.sendStatus(501);
                          } else {
                            res.sendStatus(201);
                          }
                        });
                      }
                    });
                  }
                });
                // res.sendStatus(201);
              }
            });
            // res.sendStatus(201);
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});






module.exports = router;
