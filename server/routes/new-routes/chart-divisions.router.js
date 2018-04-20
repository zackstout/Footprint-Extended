
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../../modules/pool.js');

// NOT SURE WHAT'S GOING ON -- MANY ROUTES ARE APPARENTLY NOT CALLED?

//Gets all of the user's footprints that are of a certain kind (e.g. all periods, all projects) to populate dropdown for bar graph, and for donut chart:
router.post('/bars', function (req, res) {
  if (req.isAuthenticated()) {
    console.log("BODY: ", req.body);
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var queryText;
        if (req.body.view == 'period') {
          queryText = 'SELECT "period" as period FROM "projects" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" WHERE "users"."id" = $1 GROUP BY "period";';
        } else if (req.body.view == 'project') {
          queryText = 'SELECT "projects"."name" as project FROM "projects" JOIN "users" ON "users"."id" = "projects"."user_id" WHERE "users"."id" = $1;';
        } else if (req.body.view == 'country') {
          queryText = 'SELECT "countries"."name" as country FROM "projects" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "countries" ON "countries"."id" = "projects"."country_id" WHERE "users"."id" = $1;';
        } else if (req.body.view == 'type') {
          queryText = 'SELECT "types"."name" as type FROM "projects" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id"="type_id" WHERE "users"."id" = $1 GROUP BY "types"."name";';
        }
        db.query(queryText, [req.user.id], function (errorMakingQuery, result) {
          done();
          if (errorMakingQuery) {
            console.log('Error with country GET', errorMakingQuery);
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


//Gets the requested footprint data, summed into one row:
router.post('/bars_numbers', function (req, res) {
  // if (req.isAuthenticated()) {
    console.log("BODY: ", req.body);
    var view;
    var particular;

    if (req.body.view == 'project') {
      view = 'projects';
    } else if (req.body.view == 'period') {
      view = 'periods';
    } else if (req.body.view == 'country') {
      view = 'countries';
    } else if (req.body.view == 'type') {
      view = 'types';
    }
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var queryText;
        if (req.body.view == 'project') {
          queryText = 'SELECT SUM(air) as air, SUM(truck) as truck, SUM(sea) as sea, SUM(freight_train) as freight_train, SUM(plane) as plane, SUM(car) as car, SUM(train) as train, SUM(hotel) as hotel, SUM(grid) as grid, SUM(propane) as propane, SUM(fuel) as fuel FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 AND "projects"."name" = ' + '\'' + req.body.particular + '\'' + ';';
        } else if (req.body.view == 'period') {
          var period = req.body.particular.slice(0, 10);
          queryText = 'SELECT SUM(air) as air, SUM(truck) as truck, SUM(sea) as sea, SUM(freight_train) as freight_train, SUM(plane) as plane, SUM(car) as car, SUM(train) as train, SUM(hotel) as hotel, SUM(grid) as grid, SUM(propane) as propane, SUM(fuel) as fuel FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 AND "period" = ' + '\'' + period + '\'' + ';';
        } else if (req.body.view == 'country') {
          queryText = 'SELECT SUM(air) as air, SUM(truck) as truck, SUM(sea) as sea, SUM(freight_train) as freight_train, SUM(plane) as plane, SUM(car) as car, SUM(train) as train, SUM(hotel) as hotel, SUM(grid) as grid, SUM(propane) as propane, SUM(fuel) as fuel FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 AND "countries"."name" = ' + '\'' + req.body.particular + '\'' + ';';
        } else if (req.body.view == 'type') {
          queryText = 'SELECT SUM(air) as air, SUM(truck) as truck, SUM(sea) as sea, SUM(freight_train) as freight_train, SUM(plane) as plane, SUM(car) as car, SUM(train) as train, SUM(hotel) as hotel, SUM(grid) as grid, SUM(propane) as propane, SUM(fuel) as fuel FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 AND "types"."name" = ' + '\'' + req.body.particular + '\'' + ';';
        }


        db.query(queryText, [req.user.id], function (errorMakingQuery, result) {
          done();
          if (errorMakingQuery) {
            console.log('Error with country GET', errorMakingQuery);
            res.sendStatus(501);
          } else {
            console.log(result.rows);
            res.send(result.rows);
          }
        });
      }
    });
  // } else {
  //   res.sendStatus(401);
  // }
});



// The root issue is that my curyDivisions function isn't working as expected. All the user-built charts are broken. 


// THIS DOESN'T SEEM TO BE CALLED ANYWHERE?
//Prepare line graph:
// router.get('/linegraph', function (req, res) {
//   if (req.isAuthenticated()) {
//     console.log('info for line graph');
//     pool.connect(function (err, db, done) {
//       if (err) {
//         console.log('error connecting', err);
//         res.sendStatus(500);
//       }
//       else {
//         var querytext = 'SELECT "period", "project_id", "hotel" + "fuel" + "grid" + "propane" as living_total, "air"+ "truck"+ "sea"+"freight_train" as shipping_total, "plane"+ "car"+ "train" as travel_total, "footprints"."id" as footprint_id, "projects"."user_id" as user_id FROM "projects" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "user_id"=2 ORDER BY "period";';
//         db.query(querytext, function (errorMakingQuery, result) {
//           done();
//           if (errorMakingQuery) {
//             console.log('Error with Line Graph Get', errorMakingQuery);
//             res.sendStatus(501);
//           } else {
//             res.send(result);
//           }
//         });
//       }
//     });
//   } else {
//     res.sendStatus(401);
//   }
// });



// THIS DOESN'T SEEM TO BE CALLED??? called in self.getDonut, which we commented out, maybe mistakenly....
// Ok i think we've fixed this one, but uncommenting. But how do we fix other 4????


//Gets all the compiled data for footprints of a certain kind (e.g. period) and sliced in a certain way (e.g. by category):
router.post('/donut', function (req, res) {
  // if (req.isAuthenticated()) {
    console.log("BODY: ", req.body);
    pool.connect(function (err, db, done) {
      if (err) {
        console.log('Error connecting', err);
        res.sendStatus(500);
      } else {
        var view, particular, slice, queryText, array, blingArray;

        if (req.body.view == 'type') {
          view = '"types"';
        } else if (req.body.view == 'project') {
          view = "projects";
        } else if (req.body.view == 'country') {
          view = "countries";
        }

        if (req.body.slice == 'Type') {
          slice = '"project_type"."type_id"';
        } else if (req.body.slice == 'Project') {
          slice = '"projects"."name"';
        } else if (req.body.slice == 'Period') {
          slice = '"period"';
        } else if (req.body.slice == 'Country') {
          slice = '"countries"';
        }

        particular = req.body.particular;
        blingArray = [req.user.id, particular];

        queryText = 'SELECT "period", "countries"."id" as country_id, "projects"."name", "project_type"."type_id", SUM("hotel") OVER (PARTITION BY ' + slice + ') as hotel, SUM("fuel") OVER (PARTITION BY ' + slice + ') as fuel, SUM("propane") OVER (PARTITION BY ' + slice + ') as propane, SUM("grid") OVER (PARTITION BY ' + slice + ') as grid, SUM("air") OVER (PARTITION BY ' + slice + ') as air, SUM("sea") OVER (PARTITION BY ' + slice + ') as sea, SUM("truck") OVER (PARTITION BY ' + slice + ') as truck, SUM("freight_train") OVER (PARTITION BY ' + slice + ') as freight_train, SUM("car") OVER (PARTITION BY ' + slice + ') as car, SUM("plane") OVER (PARTITION BY ' + slice + ') as plane, SUM("train") OVER (PARTITION BY ' + slice +
          ') as train FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 AND ' + view + '."name" = $2;';

        if (req.body.slice == 'Category') {
          queryText = 'SELECT SUM("hotel") as hotel, SUM("fuel") as fuel, SUM("grid") as grid, SUM("propane") as propane, SUM("air") as air, SUM("sea") as sea, SUM("truck") as truck, SUM("freight_train") as freight_train, SUM("car") as car, SUM("plane") as plane, SUM("train") as train FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 AND ' + view + '."name" = $2;';
        }

        if (req.body.view == 'category') {
          blingArray = [req.user.id, 10000];
          queryText = 'SELECT "period", "countries"."id" as country_id, "projects"."name", "project_type"."type_id", SUM("hotel") OVER (PARTITION BY ' + slice + ') as hotel, SUM("fuel") OVER (PARTITION BY ' + slice + ') as fuel, SUM("propane") OVER (PARTITION BY ' + slice + ') as propane, SUM("grid") OVER (PARTITION BY ' + slice + ') as grid, SUM("air") OVER (PARTITION BY ' + slice + ') as air, SUM("sea") OVER (PARTITION BY ' + slice + ') as sea, SUM("truck") OVER (PARTITION BY ' + slice + ') as truck, SUM("freight_train") OVER (PARTITION BY ' + slice + ') as freight_train, SUM("car") OVER (PARTITION BY ' + slice + ') as car, SUM("plane") OVER (PARTITION BY ' + slice + ') as plane, SUM("train") OVER (PARTITION BY ' + slice +
            ') as train FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1 OR "users"."id" = $2;';
        }

        if (req.body.view == 'period') {
          var particularPeriod = '\'' + req.body.particular + '\'';
          blingArray = [req.user.id, 10000];
          queryText = 'SELECT "period", "countries"."id" as country_id, "projects"."name", "project_type"."type_id", SUM("hotel") OVER (PARTITION BY ' + slice + ') as hotel, SUM("fuel") OVER (PARTITION BY ' + slice + ') as fuel, SUM("propane") OVER (PARTITION BY ' + slice + ') as propane, SUM("grid") OVER (PARTITION BY ' + slice + ') as grid, SUM("air") OVER (PARTITION BY ' + slice + ') as air, SUM("sea") OVER (PARTITION BY ' + slice + ') as sea, SUM("truck") OVER (PARTITION BY ' + slice + ') as truck, SUM("freight_train") OVER (PARTITION BY ' + slice + ') as freight_train, SUM("car") OVER (PARTITION BY ' + slice + ') as car, SUM("plane") OVER (PARTITION BY ' + slice + ') as plane, SUM("train") OVER (PARTITION BY ' + slice +
            ') as train FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE (("users"."id" = $1) OR ("users"."id" = $2)) AND "period" =' + particularPeriod + ';';
        }

        if (req.body.view == 'period' && req.body.slice == 'Category') {
          var particularPeriod2 = '\'' + req.body.particular + '\'';
          blingArray = [req.user.id, 10000];
          queryText = 'SELECT SUM("hotel") as hotel, SUM("fuel") as fuel, SUM("grid") as grid, SUM("propane") as propane, SUM("air") as air, SUM("sea") as sea, SUM("truck") as truck, SUM("freight_train") as freight_train, SUM("car") as car, SUM("plane") as plane, SUM("train") as train FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE (("users"."id" = $1) OR ("users"."id" = $2)) AND "period" =' + particularPeriod2 + ';';

        }

        db.query(queryText, blingArray, function (err, result) {
          done();
          if (err) {
            console.log('Error making query', err);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
            console.log(result.rows);
          }
        });
      }
    });
  // } else {
  //   res.sendStatus(401);
  // }
});

// ALSO DOESN'T SEEM TO BE CALLED??

//slices a user's total footprint by projects..which now that I think about it is not the most useful thing, but it is a skeleton for more useful things:
// router.get('/footprint_by_project', function (req, res) {
//   // if (req.isAuthenticated()) {
//     pool.connect(function (err, db, done) {
//       if (err) {
//         console.log('Error connecting', err);
//         res.sendStatus(500);
//       } else {
//         var queryText = 'SELECT "projects"."name", SUM("hotel") OVER (PARTITION BY "projects"."name") as hotel, SUM("fuel") OVER (PARTITION BY "projects"."name") as fuel, SUM("propane") OVER (PARTITION BY "projects"."name") as propane, SUM("grid") OVER (PARTITION BY "projects"."name") as grid, SUM("air") OVER (PARTITION BY "projects"."name") as air, SUM("sea") OVER (PARTITION BY "projects"."name") as sea, SUM("truck") OVER (PARTITION BY "projects"."name") as truck, SUM("freight_train") OVER (PARTITION BY "projects"."name") as freight_train, SUM("car") OVER (PARTITION BY "projects"."name") as car, SUM("plane") OVER (PARTITION BY "projects"."name") as plane, SUM("train") OVER (PARTITION BY "projects"."name") as train FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON ' +
//           '"types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON' + '"projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = 3;';
//         db.query(queryText, [], function (err, result) {
//           done();
//           if (err) {
//             console.log('Error making query', err);
//             res.sendStatus(500);
//           } else {
//             res.send(result.rows);
//           }
//         });
//       }
//     });
//   // } else {
//   //   res.sendStatus(401)
//   // }
// });

// ALSO NOT CALLED??

//Slices total footprint of an organization by period, used for line graph on home page (FP's fp):
// router.get('/footprints_footprint_by_period', function (req, res) {
//   // if (req.isAuthenticated()) {
//     var userId = 1;
//     pool.connect(function (err, db, done) {
//       if (err) {
//         console.log('Error connecting', err);
//         res.sendStatus(500);
//       } else {
//         var queryText = 'SELECT "period", SUM("hotel") OVER (PARTITION BY "period") as hotel, SUM("fuel") OVER (PARTITION BY "period") as fuel, SUM("propane") OVER (PARTITION BY "period") as propane, SUM("grid") OVER (PARTITION BY "period") as grid, SUM("air") OVER (PARTITION BY "period") as air, SUM("sea") OVER (PARTITION BY "period") as sea, SUM("truck") OVER (PARTITION BY "period") as truck, SUM("freight_train") OVER (PARTITION BY "period") as freight_train, SUM("car") OVER (PARTITION BY "period") as car, SUM("plane") OVER (PARTITION BY "period") as plane, SUM("train") OVER (PARTITION BY "period") as train ' +
//           'FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1;';
//         db.query(queryText, [userId], function (err, result) {
//           done();
//           if (err) {
//             console.log('Error making query', err);
//             res.sendStatus(500);
//           } else {
//             res.send(result.rows);
//           }
//         });
//       }
//     });
//   // }
//   // else {
//   //   res.sendStatus(401);
//   // }
// });


// SAME SHIT, NOT CALLED, AS FAR AS VS CODE PROJECT SEARCH IS CONCERNED:

//Slices total footprint of an organization by period, used for line graph on home page (FP's fp):
// router.get('/footprint_by_period', function (req, res) {

//   // if (req.isAuthenticated()) {
//     var userId = req.user.id;
//     pool.connect(function (err, db, done) {
//       if (err) {
//         console.log('Error connecting', err);
//         res.sendStatus(500);
//       } else {
//         var queryText = 'SELECT "period", SUM("hotel") OVER (PARTITION BY "period") as hotel, SUM("fuel") OVER (PARTITION BY "period") as fuel, SUM("propane") OVER (PARTITION BY "period") as propane, SUM("grid") OVER (PARTITION BY "period") as grid, SUM("air") OVER (PARTITION BY "period") as air, SUM("sea") OVER (PARTITION BY "period") as sea, SUM("truck") OVER (PARTITION BY "period") as truck, SUM("freight_train") OVER (PARTITION BY "period") as freight_train, SUM("car") OVER (PARTITION BY "period") as car, SUM("plane") OVER (PARTITION BY "period") as plane, SUM("train") OVER (PARTITION BY "period") as train ' +
//           'FROM "countries" JOIN "projects" ON "countries"."id" = "projects"."country_id" JOIN "project_type" ON "projects"."id" = "project_type"."project_id" JOIN "types" ON "types"."id" = "project_type"."type_id" JOIN "users" ON "users"."id" = "projects"."user_id" JOIN "footprints" ON "projects"."id" = "footprints"."project_id" JOIN "living" ON "footprints"."id" = "living"."footprint_id" JOIN "shipping" ON "footprints"."id" = "shipping"."footprint_id" JOIN "travel" ON "footprints"."id"= "travel"."footprint_id" WHERE "users"."id" = $1;';
//         db.query(queryText, [userId], function (err, result) {
//           done();
//           if (err) {
//             console.log('Error making query', err);
//             res.sendStatus(500);
//           } else {
//             res.send(result.rows);
//           }
//         });
//       }
//     });
//   // } else {
//   //   res.sendStatus(401);
//   // }
// });







module.exports = router;
