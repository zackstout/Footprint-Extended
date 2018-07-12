
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../../modules/pool.js');

//SUCCESSFULLY TRANSFERRED ROUTES:

var types = ['Health', "Food/Nutrition", "Education", 'Non-Food Items (NFI)', "Shelter", "Conflict", "Migration/Camp Management", "Faith-based", "Research", "Governance", "Business/Entrepreneur", "Donor"];


// Get all countries:
router.get('/countries', function (req, res) {

  console.log('Get Countries');
  pool.connect(function (err, db, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    else {
      var queryText = 'SELECT * FROM "countries";';
      db.query(queryText, function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
          res.sendStatus(501);
        } else {
          res.send(result);
        }
      });
    }
  });

});

router.get('/getid/:name', function (req, res) {

  pool.connect(function (err, db, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    else {

      // Did i delete the comment about only getting projects with one or more types? But that's fine right? Because no-types are also negating this query where we Join on project_type:
      // Issue: this is only getting a single type_id: we need an array. Or, a GROUPBY:

      
      var queryText = 'SELECT "projects"."id" as id, "projects"."name" as name, "projects"."country_id" as country_id, "project_type"."type_id" as type_id FROM "projects" JOIN "users" ON "projects"."user_id" = "users"."id" JOIN "project_type" ON "project_type"."project_id" = "projects"."id" WHERE "users"."id" = $1 AND "projects"."name" = $2;';
      db.query(queryText, [req.user.id, req.params.name], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
          res.sendStatus(501);
        } else {
          res.send(result);
        }
      });
    }
  });

});

// Get name of certain country:
router.get('/countries/:id', function (req, res) {

  console.log('Get Countries name', req.params.id);
  pool.connect(function (err, db, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    else {
      var queryText = 'SELECT "name" FROM "countries" WHERE id=$1;';
      db.query(queryText, [req.params.id], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
          res.sendStatus(501);
        } else {
          res.send(result);
        }
      });
    }
  });

});

// Create a project:
router.post('/newproject', function (req, res) {
  if (req.isAuthenticated()) {
    console.log("BODY: ", req.body);
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var queryText = 'SELECT * FROM "countries" WHERE "countries"."name" = $1;';

        db.query(queryText, [req.body.selectedCountry], function (errorMakingQuery, result) {
          if (errorMakingQuery) {
            console.log('Error with country GET', errorMakingQuery);
          } else {
            console.log(result.rows[0]);
            queryText = 'INSERT INTO "projects" ("name", "user_id", "country_id") VALUES ($1, $2, $3) RETURNING id;';
            db.query(queryText, [req.body.projectName, req.user.id, result.rows[0].id], function (err, result) {
              done();
              if (err) {
                console.log(err);
              } else {
                console.log("ID: ", result.rows[0].id);

                for (var i = 0; i < req.body.project.length - 1; i++) { // also infected by poor naming as "project" or "countryIn", when really it's tracking types.....Oh well.
                  var typeNow = types.indexOf(req.body.project[i]);
                  queryText = 'INSERT INTO "project_type" ("project_id", "type_id") VALUES ($1, $2);';
                  db.query(queryText, [result.rows[0].id, typeNow + 1], handlePost);
                }
                var typeNow2 = types.indexOf(req.body.project[req.body.project.length - 1]);
                queryText = 'INSERT INTO "project_type" ("project_id", "type_id") VALUES ($1, $2);';
                db.query(queryText, [result.rows[0].id, typeNow2 + 1], function (err, result) {
                  done();
                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(201);

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

function handlePost(err, result) {
  if (err) {
    console.log('whoops dog');
  } else {
    console.log('well done amigo');
  }
}


//Gets all of a user's projects to populate the dropdown in upload footprint modal:
router.get('/allprojects', function (req, res) {
  if (req.isAuthenticated()) {
    pool.connect(function (err, db, done) {
      if (err) {
        console.log("Error connecting for project footprints: ", err);
        res.sendStatus(500);
      }
      else {
        var queryText = 'SELECT * FROM "projects" WHERE user_id = $1';
        db.query(queryText, [req.user.id], function (errorMakingQuery, result) {
          done();
          if (errorMakingQuery) {
            console.log('Error with project footprints GET', errorMakingQuery);
            res.sendStatus(501);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});



// Get all footprints for a project:
router.get('/project_footprints/:projectId', function (req, res) {
  if (req.isAuthenticated()) {
    console.log('Get Footprints');
    console.log('project id', projectId);
    var projectId = req.params.projectId;
    pool.connect(function (err, db, done) {
      if (err) {
        console.log("Error connecting for project footprints: ", err);
        res.sendStatus(500);
      }
      else {
        var queryText = 'SELECT * FROM "footprints" WHERE project_id = $1 ORDER BY period';
        db.query(queryText, [projectId], function (errorMakingQuery, result) {
          done();
          if (errorMakingQuery) {
            console.log('Error with project footprints GET', errorMakingQuery);
            res.sendStatus(501);
          } else {
            res.send(result);
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});


// Q: Why is this needed over and above GET /allprojects?
// Answer: for the list of user projects on projects view
router.get('/userprojects/:userId', function (req, res) {
  if (req.isAuthenticated()) {
    console.log('user id', req.user);
    userId = req.user.id;
    console.log(userId);
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var queryText = 'SELECT projects.*, array_agg(project_type.type_id) as projectTypes, array_agg(types.name) as names FROM projects JOIN project_type ON projects.id = project_type.project_id JOIN types ON project_type.type_id = types.id WHERE user_id = $1 GROUP BY projects.id;';
        db.query(queryText, [userId], function (err, result) {
          done();
          if (err) {
            console.log('Error making query', err);
            res.sendStatus(500);
          } else {
            console.log('result', result.rows);
            res.send(result.rows);
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});



// Edit a project by uploading a new CSV for a certain month:
router.put('/project_edit', function (req, res) {
  if (req.isAuthenticated()) {
    var footprint = req.body;
    var project_id = req.body.projectInfo.project_id;
    var date = req.body.projectInfo.period;
    var updatedDate = date.slice(0, 10);
    console.log(updatedDate);
    // console.log('Footprint data:', footprint, 'ProjectID:', project_id);
    pool.connect(function (err, db, done) {
      var queryText = 'SELECT "id" FROM "footprints" WHERE "project_id" = $1 AND "period" = $2;';
      db.query(queryText, [project_id, updatedDate], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var footprintid = result.rows[0].id;
          queryText = 'UPDATE "shipping" SET "air" = $1, "truck"= $2 , "sea" = $3, "freight_train" = $4 WHERE "footprint_id" = $5;';
          db.query(queryText, [footprint.air, footprint.sea, footprint.truck, footprint.train_shipping, footprintid], function (err, result) {
            if (err) {
              console.log(err);
            } else {
              queryText = 'UPDATE "travel" SET "plane" = $1, "car"= $2, "train" = $3 WHERE "footprint_id" = $4;';
              db.query(queryText, [footprint.plane, footprint.car, footprint.train_travel, footprintid], function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  queryText = 'UPDATE "living" SET "hotel" = $1, "fuel" = $2, "grid" = $3, "propane" = $4 WHERE "footprint_id" = $5;';
                  db.query(queryText, [footprint.hotel, footprint.grid, footprint.fuel, footprint.propane, footprintid], function (err, result) {
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
    });
  } else {
    res.sendStatus(401);
  }
});



module.exports = router;
