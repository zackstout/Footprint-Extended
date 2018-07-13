
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

  const websitename = 'localhost:3000';

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
    
    // Hmm, this doesn't appear to be working...:
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



// Handles request for HTML file (once successfully followed link from email):
router.get('/newPassword', function(req, res, next) {
  let secretCode = req.query.secretCode;

  console.log("issa secret! ... ", secretCode);

  // Make a Select query to check whether this code is still live. GET the user ID.
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }

  });

// Hmmmm this isn't hooking up to its controller like the Register one is... probably because that has an href..:
  res.sendFile(path.resolve(__dirname, '../../public/views/templates/forgotNew.html'));
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





function makeRandomString(len) {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = '';
  for (let i=0; i < len; i++) {
    res += possible[Math.floor(Math.random() * possible.length)];
  }
  return res;
}





// This should be pretty straightforward:

router.post('/contact', function (req, res) {
  var mailOptions = {
    from: req.body.email,
    to: 'hi',// WILL'S EMAIL GOES HERE,
    subject: req.body.subject,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

});





module.exports = router;
