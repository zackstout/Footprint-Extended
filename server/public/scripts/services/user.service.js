myApp.service('UserService', function ($http, $location){
  // AHHH, IT'S PISSED ABOUT A CIRCULAR DEPENDENCY: CAN'T BRING CSVSERVICE IN HERE.
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};
  self.calc = {data: []};
  self.userProjects = {};
  self.countries = {data: []};
  self.months = ['January','February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
  self.result = {};
  self.lineGraphData={};
  self.footprintsFootprint = {};
  self.clickedProject = {};
  self.users = [];
  self.userObj = { selectedIndex: 0 };
  self.selectedProjectFootprints = [];
  self.newProject = false;


  self.country = '';
  self.name = '';
  self.types = [];


  self.successfulUpload = false;

  let observerCallbacks = [];

  self.registerObserverCallback = function(cb) {
    observerCallbacks.push(cb);
  };

  function notifyObservers() {
    angular.forEach(observerCallbacks, function(cb) {
      cb();
    });
  }

  const PLANE_CONVERSION = 0.18026;
  const CAR_CONVERSION = 0.18568;
  const TRAIN_CONVERSION = 0.01225;
  const AIR_CONVERSION = 1.45648;
  const FREIGHT_CONVERSION = 2.60016;
  const TRUCK_CONVERSION = 0.10559;
  const SEA_CONVERSION = 0.008979;
  const HOTEL_CONVERSION = 31.1; // Wow this is huge!
  const FUEL_CONVERSION = 2.60016;
  const GRID_CONVERSION = 0.35156;
  const PROPANE_CONVERSION = 0.1864;

  const MI_TO_KM = 1.609344;
  const TON_MI_TO_TONNE_KM = 1.460;

  // THE MAIN 3 bits of functionality (computing parsed CSVs):
  // Ok applying .toFixed breaks the Trial upload, and doesn't even solve our problem.
  self.changeToImperial = function(csv) {
    // Very interesting, this has to be an integer. Won't work as a float.
    csv.plane = parseInt((csv.plane * MI_TO_KM));
    csv.car = parseInt((csv.car * MI_TO_KM));
    csv.train_travel = parseInt((csv.train_travel * MI_TO_KM));
    csv.air = parseInt((csv.air * TON_MI_TO_TONNE_KM));
    csv.train_shipping = parseInt((csv.train_shipping * TON_MI_TO_TONNE_KM));
    csv.truck = parseInt((csv.truck * TON_MI_TO_TONNE_KM));
    csv.sea = parseInt((csv.sea * TON_MI_TO_TONNE_KM));
    return csv;
  };

  // moved to FPs:
  self.computeFootprint = function(footprint) {
    // console.log(footprint);
    var result = {};
    // Probably a clever way to do this for a for loop:
    result.plane = PLANE_CONVERSION * parseInt(footprint.plane);
    result.car = CAR_CONVERSION * parseInt(footprint.car);
    result.train = TRAIN_CONVERSION * parseInt(footprint.train);
    result.air = AIR_CONVERSION * parseInt(footprint.air);
    result.freight_train = FREIGHT_CONVERSION * parseInt(footprint.freight_train);
    result.truck = TRUCK_CONVERSION * parseInt(footprint.truck);
    result.sea = SEA_CONVERSION * parseInt(footprint.sea);
    result.hotel = HOTEL_CONVERSION * parseInt(footprint.hotel);
    result.fuel = FUEL_CONVERSION * parseInt(footprint.fuel);
    result.grid = GRID_CONVERSION * parseInt(footprint.grid);
    result.propane = PROPANE_CONVERSION * parseInt(footprint.propane);
    result.period = footprint.period;
    result.name = footprint.name;
    result.type_id = footprint.type_id;
    result.country_id = footprint.country_id;
    result.organization = footprint.organization;

    // why called so many times on page load???
    // THIS IS A KEY QUESTION -- WHY?? On both dashboard and home page!

    return result;
  };

  self.groupByCategory = function(footprint) {
    var result = {};
    // console.log(footprint);
    result.living = footprint.hotel + footprint.fuel + footprint.grid + footprint.propane;
    result.shipping = footprint.sea + footprint.air + footprint.truck + footprint.freight_train;
    result.travel = footprint.plane + footprint.train + footprint.car;
    self.result = result;
    // console.log("USERSERVICE groupByCat result: ", self.result);
    return self.result;
  };




  var fpfp = {};

  //Get user function
  self.getuser = function(){
    console.log('UserService -- getuser');
    // wait what route is this pinging???? Ohhh we changed the url.
    $http.get('/user2/user').then(function(response) {
      if(response.data.username) {
        // user has a current session on the server
        self.userObject.userName = response.data.username;
        self.userObject.organization = response.data.organization;
        self.userObject.name = response.data.name;
        self.userObject.position = response.data.position;
        self.userObject.id = response.data.id;
        return self.userObject;
        // console.log('UserService -- getuser -- User Data: ', self.userObject.userName, self.userObject.organization, self.userObject.id);
      } else {
        console.log('UserService -- getuser -- failure');
        // user has no session, bounce them back to the login page
        $location.path("/home");
      }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  }, //End get user function
  // WHY DOES IT WANT A COMMA HERE???

  //Function that logs out user
  self.logout = function() {
    console.log('UserService -- logout');

    // clear out the user object:
    self.userObject = {};
    $http.get('/user2/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      window.location.href = '/#/home';
      // $location.path("/home");
    });
  }; //End of Logout Function /// what is the error???




  // Oh isn't that so much more pleasant to the eye?
  self.getFootprint = function(id) {
    console.log('hello', id);
    // $http.get('/footprints/footprint')
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));
  };








  self.uploadTransition = function(data) {
    // Check whether user is logged in:
    if (data.userId == undefined) {
      $http.post('/csv/trial_transition', data).then(function(res) {
        console.log('allo');
      });
    } else {
      $http.post('/csv/user_transition', data).then(function(res) {
        console.log('allo mate');
      });
    }
  };




  // moved to projects:
  self.getCountries = function() {
    $http.get('/project/countries').then(function(response) {
      var countries = response.data.rows;
      self.countries.data = countries;
    });
  };


  self.getCountries();





 // ----------------------------------- the difficiult ones: -----------------------------------



  // Gets the users projects for the projects view. Called when new project is uploaded so that user can be taken to new project screen.
  self.getProjects = function (id) {

    return $http.get('project/userprojects/' + id).then(function (response) {
      self.userProjects = response.data;
      // console.log(self.userProjects); // WHOA THIS IS CRAZY WRONG! (it's not account for any projects that *don't* have types) // Ok -- just don't let them enter projects without types.

      // ******* Hmm still not working from Projects page itself though *******.

      // ahhhhh Yes the problem is this isn't being ordered correctly:
      self.userProjects.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      // console.log(self.userProjects);
      // self.clickedProject = self.userProjects[self.userProjects.length - 1];

      return self.userProjects;
    }).catch(function (err) {
      console.log('problem getting projects', err);
    });
  };


  // moved to FPs:
  //gets the footprints for selected project
  self.getProjectFootprints = function (id){
    return $http.get('/project/project_footprints/'+ id).then(function (response) {
      // I wonder if same trick will work here...
      // self.userProjects.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      // self.clickedProject = self.userProjects[self.userProjects.length - 1]; // only if new proejct !!!!!

      self.selectedProjectFootprints = response.data.rows;
      console.log("FOOTPRINTS ARE...", self.selectedProjectFootprints, " for id no. ", id);

      // just put conditional here:

      // notifyObservers(); // With this in, when we upload new footprint from Projects page, we get taken to last project????

      return self.selectedProjectFootprints;
    }).catch(function (err) {
      console.log('problem getting project footprints', err);
    });
  };










  // moved to admin:
  //gets all the users for admin page
  self.adminGetUsers = function () {
    // console.log('Getting users for admin');
    return $http.get('admin2/users').then(function(response) {
      // console.log(response.data);

      // why are we saving this to self.users???
      self.users = response.data;
      return self.users;
      // console.log('users for admin', self.users);
    }).catch(function (err) {
      console.log('problem getting all users for admin', err);
    });
  };



  // not too sure what these 2 are doing:

  self.getFootprintsFootprint = function() {
    return $http.get('/admin2/footprints_footprint').then(function(response) {
      self.footprintsFootprint = response.data;
      //ahhhhh yes back to basics over here, chris reminds me that we need to pass this returned value into the next function:
      var data = self.computeFootprint(self.footprintsFootprint[0]);
      return self.groupByCategory(data);
    }).catch(function(err) {
      console.log('oh noooooo', err);
    });
  };



  self.computeTrialFootprint = function(footprint) {

    footprint.train = footprint.train_travel;
    footprint.freight_train = footprint.train_shipping;

    var data = self.computeFootprint(footprint);
    return self.groupByCategory(data);

  };





  // Seems like we need to know whether it's called from Dash or Projects. If from projects we'll have to Notify controller:


  // MOVED TO projects:
  //This uploads the data for a new project:
  self.sendProject = function(user){
    var project = user;
    project.project = self.countryIn; // poorly named as "countryIn"; is really the types.
    // console.log(user);

    $http.post('/project/newproject', project).then(function(response) {

      self.getProjects().then(function(res) {

        res.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        self.clickedProject = res[res.length - 1];

        self.clickedProject.country = user.selectedCountry;
        // self.types = project.project; // i don't think we need this or the next one
        // self.name = user.projectName;
        self.selectedProjectFootprints = self.getProjectFootprints(self.clickedProject.id); // Is this blocking?
        self.userProjects = res;
        // All right, this works ... But it doesn't show country, and it doesn't add the project to the side bar of projects:
        // Oh, and another issue is that we're not clearing the footprints.
        // So, let's find a better way (to change Project view when we create a project from /projects)
        notifyObservers();

        window.location.href = '/#/projects';

      });

    }).catch(function(error) {
      console.log(error);
    });
  };




  // (3) EDITING A FP:
  //This function sends edited footprints to the DB.
  self.sendEdits = function (dataIn, parsed) {
    var data = dataIn.data;
    var footprintInfo = dataIn.project;
    // console.log(parsed);

    // Mutate it directly:
    if (parsed.type === 'English') {
      this.changeToImperial(parsed);
    }

    parsed.projectInfo = footprintInfo;
    self.sendEditsOut(parsed);

  }; //End send function

  self.sendEditsOut = function (csvSend) {
    $http.put('/project/project_edit', csvSend).then(function (response) {
    }).catch(function (error) {
      console.log('error sending footprint', error);
    });
  };

}); //End of UserService
