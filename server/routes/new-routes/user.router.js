
var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../../modules/pool.js');
var encryptLib = require('../../modules/encryption');


//SUCCESSFULLY TRANSFERRED ROUTES:


// Copied from register.router (changing both URLs):

// Handles request for HTML file
// router.get('/register', function(req, res, next) {

//   res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
// });

// // Handles POST request with new user data
// router.post('/register', function(req, res, next) {

//   var saveUser = {
//     username: req.body.username,
//     password: encryptLib.encryptPassword(req.body.password),
//     organization: req.body.organization,
//     name: req.body.name,
//     position: req.body.position
//   };
//   // console.log('new user:', saveUser);

//   pool.connect(function(err, client, done) {
//     if(err) {
//       console.log("Error connecting: ", err);
//       res.sendStatus(500);
//     }
//     client.query("INSERT INTO users (username, password, organization, name, position) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
//       [saveUser.username, saveUser.password, saveUser.organization, saveUser.name, saveUser.position],
//         function (err, result) {
//           client.end();

//           if(err) {
//             console.log("Error inserting data: ", err);
//             res.sendStatus(500);
//           } else {
//             res.sendStatus(201);
//           }
//         });
//   });

// });

// Copied from user.router (changing first URL):

// Handles Ajax request for user information if user is authenticated
router.get('/user', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    // console.log('logged in', req.user);
    var userInfo = {
      username : req.user.username,
      organization: req.user.organization,
      id: req.user.id
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    // console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  // console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

module.exports = router;
