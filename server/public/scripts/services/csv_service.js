myApp.service('csvService', function ($http, $location, UserService) {
  console.log('csvService Loaded');

  var vm = this;
  vm.userFootprint = { userInfo: [], userType: [], dataIn: [] };




  // NEW IDEA: LET'S JUST REFACTOR THIS PART, AND THEN A BIT MORE AS WE GO ON:
  // AND OK THE ROUTES CHANGES TOO, JUST FOR READABILITY. CAN USE VS CODE FIND IN PROJECT TO MAKE IT EASY.

  vm.dataType = '';


  // Ok we're close to finding the problem. Hotel is getting logged as 10 even though it's 0. We must be looking at the one to the left of what we intend.
  // Nah not quite: but if we take out the Date columns completely, it works.
  // To add back in dates later, trying testing with sample data 1 2 3 etc., This will make it easier to debug.
  //******* Ok we actually need *one* Date column to make it work as intended.

  // moved to CSV:

  vm.masterParse = function(data) {
    var dataNums = data.slice(data.lastIndexOf('kWh'), data.indexOf(',,,,,,,,,,'));
    var arrayOfNums = dataNums.split(',');
    var csv = {
      plane: 0,
      car: 0,
      train_travel: 0,
      air: 0,
      train_shipping: 0,
      truck: 0,
      sea: 0,
      hotel: 0,
      fuel: 0,
      grid: 0,
      propane: 0,
      organization: ''
    };

    for (var i = 0; i < arrayOfNums.length; i++) {
      var num = arrayOfNums[i];
      if (i % 11 == 1 && num !== '') {
        csv.plane += Number(num);
      } else if (i % 11 == 2 && num !== '') {
        csv.car += Number(num);
      } else if (i % 11 == 3 && num !== '') {
        csv.train_travel += Number(num);
      } else if (i % 11 == 4 && num !== '') {
        csv.air += Number(num);
      } else if (i % 11 == 5 && num !== '') {
        csv.train_shipping += Number(num);
      } else if (i % 11 == 6 && num !== '') {
        csv.truck += Number(num);
      } else if (i % 11 == 7 && num !== '') {
        csv.sea += Number(num);
      } else if (i % 11 == 8 && num !== '') {
        csv.hotel += Number(num);
      } else if (i % 11 == 9 && num !== '') {
        csv.fuel += Number(num);
      } else if (i % 11 == 10 && num !== '') {
        csv.grid += Number(num);
      } else if (i % 11 == 0 && num !== '' && i > 1) {
        csv.propane += Number(num);
      }
    }
    // console.log(csv);

    return csv;
  };



// (1)
  //This function parses the data from uploaded CSVs.
  vm.parseData = function (data) {
    var dataNums = data.slice(data.lastIndexOf('kWh'), data.indexOf(',,,,,,,,,,'));
    var arrayOfNums = dataNums.split(',');

    // good this works:
    csv = this.masterParse(data);
    console.log("parse Data 1: ", csv); // an object whose properties are values for each category -- contains both train, freight_train and train_travel, train_shipping -- why???

    if (vm.dataType.type === 'English') {

      // new function:
      var imp = UserService.changeToImperial(csv);
      console.log("IMP", imp);


    }

    // so we pushed it onto this array just to grab it here??
    csv.organization = (vm.userFootprint.userInfo[0].selectedOrganization);

  // TRIGGER: ASSEMBLE THE FOOTPRINTIN OBJECT, AND CHANGE VM.USERFOOTPRINT (?)
    vm.valuesToArray(csv);

  // GOAL: COMPUTE THE FOOTPRINT SO WE CAN SAVE IT TO THE DATABASE:
    vm.trialData = UserService.computeTrialFootprint(csv);

    console.log("parse Data 3: ", vm.trialData); // Trial data, grouped by category, ready for a donut chart. Again, an object whose properties are the values, whose keys are the categories.

    return $http.post('/admin', csv).then(function (response) {
      // WHY ARE WE RETURNING THIS? ASYNC??
      return vm.trialData;
      //how odd that it logs out all as 0s here but posts into the DB ok....asynchonicity man.
    }).catch(function (err) {
      console.log('whooooops', err);
    });
  };

  //Change the CSV values to an array.
  vm.valuesToArray = function (obj) {
    var result = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push(obj[key]);
      }
    }

    vm.calculations(result);
  };


  // GOAL: ASSEMBLE THE FOOTPRINTIN OBJECT, AND CHANGE VM.USERFOOTPRINT (?)
  // REDUNDANT:
  //  This function will calculate carbon footprint data
  vm.calculations = function (result) {

    for (var i = 0; i < result.length; i++) {
      result.plane = (result[0] * 0.18026);
      result.car = (result[1] * 0.18568);
      result.train_travel = (result[2] * 0.01225);
      result.air = (result[3] * 1.45648);
      result.train_shipping = (result[4] * 2.60016271124822); //This needs to be updated (why????_)
      result.truck = (result[5] * 0.10559);
      result.sea = (result[6] * 0.008979);
      result.hotel = (result[7] * 31.1);
      result.fuel = (result[8] * 2.60016271124822);
      result.grid = (result[9] * 0.35156);
      result.propane = (result[10] * 0.186455554041745);
      result.totals = (result.plane + result.car + result.train_travel + result.air + result.train_shipping + result.truck + result.sea + result.hotel + result.fuel + result.grid + result.propane);
    }
    var footprintIn = vm.userFootprint.dataIn;
    // does this alter the object's project?
    footprintIn.push({ plane: result.plane }, { car: result.car }, { train_travel: result.train_travel }, { air: result.air }, { train_shipping: result.train_shipping }, { truck: result.truck }, { sea: result.sea }, { hotel: result.hotel }, { fuel: result.fuel }, { grid: result.grid }, { propane: result.propane }, { total: result.totals });
    console.log("parse Data 2: ", footprintIn); // array of objects with converted values as properties

  };
  //Pushes user data to an array.
  vm.userData = function (user) {

    vm.userFootprint.userInfo.push({ selectedOrganization: user.selectedOrganization });

  };
  // when called????
  //Send data to the userfootprint object.
  vm.typeData = function (sendData) {
    vm.userFootprint.userType = sendData;

  };

  // clear input: -- wait do we need this?
  var csvIn = {
    plane: 0,
    car: 0,
    train_travel: 0,
    air: 0,
    train_shipping: 0,
    truck: 0,
    sea: 0,
    hotel: 0,
    fuel: 0,
    grid: 0,
    propane: 0
  };














// (2)
  //This is the start of sending logged in user's info to the database.
  vm.projectOut = { userInfo: [], userType: [], dataIn: [] };

  // GOAL: POST A FOOTPRINT TO THE DATABASE. USE THESE 3 FUNCTIONS TO ASSEMBLE PROJECT OBJECT.
  // REDUNDANT:
  vm.parseFootprint = function (data) {
    var dataNums = data.slice(data.lastIndexOf('kWh'), data.indexOf(',,,,,,,,,,'));
    var arrayOfNums = dataNums.split(',');


    for (var i = 0; i < arrayOfNums.length; i++) {
      var num = arrayOfNums[i];
      if (i % 11 == 1 && num !== '') {
        csvIn.plane += Number(num);
      } else if (i % 11 == 2 && num !== '') {
        csvIn.car += Number(num);
      } else if (i % 11 == 3 && num !== '') {
        csvIn.train_travel += Number(num);
      } else if (i % 11 == 4 && num !== '') {
        csvIn.air += Number(num);
      } else if (i % 11 == 5 && num !== '') {
        csvIn.train_shipping += Number(num);
      } else if (i % 11 == 6 && num !== '') {
        csvIn.truck += Number(num);
      } else if (i % 11 == 7 && num !== '') {
        csvIn.sea += Number(num);
      } else if (i % 11 == 8 && num !== '') {
        csvIn.hotel += Number(num);
      } else if (i % 11 == 9 && num !== '') {
        csvIn.fuel += Number(num);
      } else if (i % 11 == 10 && num !== '') {
        csvIn.grid += Number(num);
      } else if (i % 11 == 0 && num !== '' && i > 1) {
        csvIn.propane += Number(num);
      }

    }
    //If in non-metric, change to metric.
    if (vm.dataType.type === 'English') {
      // for (var i=0; i<csv.length; i++){
      csvIn.plane = Math.round((csvIn.plane * 1.609344));
      csvIn.car = Math.round((csvIn.car * 1.609344));
      csvIn.train_travel = Math.round((csvIn.train_travel * 1.609344));
      csvIn.air = Math.round((csvIn.air * 1.460));
      csvIn.train_shipping = Math.round((csvIn.train_shipping * 1.460));
      csvIn.truck = Math.round((csvIn.truck * 1.460));
      csvIn.sea = Math.round((csvIn.sea * 1.460));
    } else {
      console.log('metric');
    }

    console.log("parseFootprint 1: ", csvIn);
    var footprintIn = vm.projectOut.dataIn;
    footprintIn.push(csvIn);
    console.log("parseFootprint 2: ", vm.projectOut);

    vm.postProjects();
  };

  //Push info to object.
  vm.sendUser = function (user) {

    vm.projectOut.userInfo.push({ selectedMonth: user.selectedMonth }, { selectedYear: user.selectedYear }, { project: user.project });
  };

  //Project function.
  vm.projectChecks = function (sendData) {
    vm.projectOut.userType = sendData;
  };






  // Moved to Projects:
  //Post route to send projects to the router.

  // Do this with argument instead of global: we made it global because it depends on all these other functions, but we can restructure it.
  vm.postProjects = function () {

    $http.post('/member/project_submit', vm.projectOut).then(function (response) {

      csvIn = {
        plane: 0,
        car: 0,
        train_travel: 0,
        air: 0,
        train_shipping: 0,
        truck: 0,
        sea: 0,
        hotel: 0,
        fuel: 0,
        grid: 0,
        propane: 0
      };
      vm.projectOut.userInfo = [];
      vm.projectOut.userType = [];
      vm.projectOut.dataIn = [];
    }).catch(function (error) {
      console.log('error adding projects', error);
    });
  };


}); //End CSV service.
