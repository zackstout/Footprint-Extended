
var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../../modules/pool.js');
var encryptLib = require('../../modules/encryption');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD
  }
});


// Kick off the forgot password process:
router.post('/initiate', function(req, res) {
  console.log("BODY HERE: ", req.body);

  const websitename = 'www.google.com';
  const secretCode = makeRandomString(45);
  const currentTime = Math.floor(new Date() / 1000);
  const expirationTime = currentTime + 60 * 60; // one hour in the future

  // Update database to save user's secret code (after getting their ID based on email/username):
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      var queryText = 'SELECT id FROM users WHERE username=$1;';

      db.query(queryText, [req.body.email], function (errorMakingQuery, result) {
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
          res.sendStatus(500);
        } else {
          // console.log(result);
          if (result.rows[0]) {
            const user_id = result.rows[0].id;
            var queryText2 = 'INSERT INTO "forgot_password" (secret_code, user_id, expires) VALUES ($1, $2, $3);';

            db.query(queryText2, [secretCode, user_id, expirationTime], function(err, result2) {
              if (err) {
                console.log(err);
              } else {
                res.sendStatus(201);
              }
            });
          } else {
            res.send('No user');
          }

        }
      });
    }
  });


  var mailOptions = {
    from: 'zackstout@gmail.com',
    to: req.body.email,
    subject: 'New Password Confirmation',

    // Hmm, this doesn't appear to be working...:
    // Oh, the only issue was with using 'localhost' -- works with a real link:
    html: `Thanks for using Footprint! <br/>Please follow this link to create a new password: <a href="${websitename}/forgot/newPassword?secretCode=${secretCode}">${websitename}/forgot/newPassword?secretCode=${secretCode}</a>.`
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
  pool.connect(function (err, db, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    else {
      var queryText = 'SELECT * FROM forgot_password WHERE secret_code = $1;';
      db.query(queryText, [secretCode], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
          res.sendStatus(501);
        } else {

          if (result.rows.length == 0) {
            res.sendFile(path.resolve(__dirname, '../../public/views/templates/alerts/forgot_invalid.html'));
          } else {
            const currentTime = Math.floor(new Date() / 1000);
            const expirationTime = result.rows[0].expires;

            if (currentTime < expirationTime) {
              // res.sendFile(path.resolve(__dirname, '../../public/views/templates/forgotNew.html'));

              // Cool, this is what we needed to get the controller hooked up to it:
              res.redirect(`/#/forgotNew/${result.rows[0].user_id}`);

            } else {
              res.sendFile(path.resolve(__dirname, '../../public/views/templates/alerts/forgot_invalid.html'));
            }
          }
        }
      });
    }
  });

  // Hmmmm this isn't hooking up to its controller like the Register one is... probably because that has an href..:
});


// The final stage, user gets to update their password:
router.post('/newPassword', function(req, res, next) {

  // Update user's password.
  pool.connect(function(err, db, done) {
    if(err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    } else {
      var queryText = 'UPDATE users SET password=$1 WHERE users.id=$2;';
      db.query(queryText, [req.body.password, req.body.user_id], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('Error with country GET', errorMakingQuery);
          res.sendStatus(501);
        } else {
          res.sendStatus(200);
        }
      });
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
    to: 'zackstout@gmail.com',// WILL'S EMAIL GOES HERE,
    subject: req.body.subject,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      console.log('Email sent: ' + info.response);
      res.sendStatus(201);
    }
  });

});





module.exports = router;
