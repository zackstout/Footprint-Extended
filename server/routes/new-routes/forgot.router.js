
var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../../modules/pool.js');
var encryptLib = require('../../modules/encryption');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zackstout@gmail.com',
    pass: 'encounter'
  }
});



// Wait.... We can't just trust the user to enter the right user name. If we do, they could just change the password for any user.
// Does this mean we need to ask for an email on registration? Yeah i think it does.
// I guess technically we are: their username is tagged as "Email" on regitstration. We could just change "Username" to say "Email" on home page.




// Kick off the forgot password process:
router.post('/initiate', function(req, res) {
  console.log("BODY HERE: ", req.body);

  console.log(makeRandomString(20));

  const websitename = 'bestwebsite.com';

  const secretCode = makeRandomString(45);

  // Update database to save user's secret code:
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }

  });


  var mailOptions = {
    from: 'zackstout@gmail.com',
    to: req.body.email,
    subject: 'New Password Confirmation',
    html: `Thanks for using Footprint! <br/>Please follow this link to create a new password: <a href="${websitename}/forgot/newPassword?seretCode=${secretCode}">${websitename}/forgot/newPassword?seretCode=${secretCode}</a>.`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

});



// The final stage, user gets to update their password:
router.post('/newPassword', function(req, res, next) {

  // Update user's password.
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }



  });
});



// Handles request for HTML file (once successfully followed link from email):
router.get('/newPassword', function(req, res, next) {
  let secretCode = req.query.secretCode;


  // Make a Select query to check whether this code is still live.
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }

  });


  res.sendFile(path.resolve(__dirname, '../public/views/templates/forgotNew.html'));
});



// Handles POST request with new user data
router.post('/', function(req, res, next) {

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password),
    organization: req.body.organization,
    name: req.body.name,
    position: req.body.position
  };
  // console.log('new user:', saveUser);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query("INSERT INTO users (username, password, organization, name, position) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
    [saveUser.username, saveUser.password, saveUser.organization, saveUser.name, saveUser.position],
    function (err, result) {
      client.end();

      if(err) {
        console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });
  });

});


function makeRandomString(len) {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = '';
  for (let i=0; i < len; i++) {
    res += possible[Math.floor(Math.random() * possible.length)];
  }
  return res;
}


module.exports = router;
