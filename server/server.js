
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');

// Route includes

// OLD ROUTES:
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var memberRouter = require('./routes/member.router');
var adminRouter = require('./routes/admin.router.js');
var barRouter = require('./routes/bars.router.js');

// NEW ROUTES:
var adminRouter2 = require('./routes/new-routes/admin.router');
var chartDivisionRouter = require('./routes/new-routes/chart-divisions.router');
var csvRouter = require('./routes/new-routes/csv.router');
var donorRouter = require('./routes/new-routes/donor.router');
var footprintRouter = require('./routes/new-routes/footprints.router.js');
var projectRouter = require('./routes/new-routes/projects.router.js');
var userRouter2 = require('./routes/new-routes/user.router.js');

var port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files

// NOTE: use this for localhost:
app.use(express.static('./server/public'));
// And use this for live version on AWS:
// app.use(express.static('./public'));


// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
// OLD ROUTES:
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/member', memberRouter);
app.use('/admin', adminRouter);
app.use('/bar', barRouter);


// NEW ROUTES:
app.use('/admin2', adminRouter2);
app.use('/chart', chartDivisionRouter);
app.use('/csv', csvRouter);
app.use('/donor', donorRouter);
app.use('/footprint', footprintRouter);
app.use('/project', projectRouter);
app.use('/user2', userRouter2);


// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, function(){
   console.log('Listening on port:', port);
});
