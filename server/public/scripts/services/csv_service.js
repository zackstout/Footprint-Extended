myApp.service('csvService', function ($http, $location, UserService) {
  console.log('csvService Loaded');

  var vm = this;
  vm.userFootprint = { userInfo: [], userType: [], dataIn: [] };



  vm.dataType = '';


// Ok we're close to finding the problem. Hotel is getting logged as 10 even though it's 0. We must be looking at the one to the left of what we intend.
// Nah not quite: but if we take out the Date columns completely, it works.
// To add back in dates later, trying testing with sample data 1 2 3 etc., This will make it easier to debug.
// Ok we actually need *one* Date column to make it work as intended.

// moved to CSV:
  //This function parses the data from uploaded CSVs.
  vm.parseData = function (data) {
    var dataNums = data.slice(data.lastIndexOf('kWh'), data.indexOf(',,,,,,,,,,'));
    var arrayOfNums = dataNums.split(',');

// Moving this in here so we don't need to clear it out:
// Although maybe don't even mess with it because we're going to restructure this whole idea.
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

    //Ok we get the correct data......
    console.log(data);
    //a switch statement would be cleaner here....if anyone is feeling motivated:
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

    console.log(csv);

    if (vm.dataType.type === 'English') {
      // for (var i=0; i<csv.length; i++){
      csv.plane = Math.round((csv.plane * 1.609344));
      csv.car = Math.round((csv.car * 1.609344));
      csv.train_travel = Math.round((csv.train_travel * 1.609344));
      csv.air = Math.round((csv.air * 1.460));
      csv.train_shipping = Math.round((csv.train_shipping * 1.460));
      csv.truck = Math.round((csv.truck * 1.460));
      csv.sea = Math.round((csv.sea * 1.460));
      csv.organization = (vm.userFootprint.userInfo[0].selectedOrganization);

    } else {
      csv.organization = (vm.userFootprint.userInfo[0].selectedOrganization);

    }

    vm.valuesToArray(csv);

    vm.trialData = UserService.computeTrialFootprint(csv);
    // ok and now this is wrong.
    console.log(vm.trialData);

    return $http.post('/admin', csv).then(function (response) {

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




// REDUNDANT:
  //  This function will calculate carbon footprint data
  vm.calculations = function (result) {

    for (var i = 0; i < result.length; i++) {
      result.plane = (result[0] * 0.18026);
      result.car = (result[1] * 0.18568);
      result.train_travel = (result[2] * 0.01225);
      result.air = (result[3] * 1.45648);
      result.train_shipping = (result[4] * 2.60016271124822); //This needs to be updated
      result.truck = (result[5] * 0.10559);
      result.sea = (result[6] * 0.008979);
      result.hotel = (result[7] * 31.1);
      result.fuel = (result[8] * 2.60016271124822);
      result.grid = (result[9] * 0.35156);
      result.propane = (result[10] * 0.186455554041745);
      result.totals = (result.plane + result.car + result.train_travel + result.air + result.train_shipping + result.truck + result.sea + result.hotel + result.fuel + result.grid + result.propane);
    }
    var footprintIn = vm.userFootprint.dataIn;
    footprintIn.push({ plane: result.plane }, { car: result.car }, { train_travel: result.train_travel }, { air: result.air }, { train_shipping: result.train_shipping }, { truck: result.truck }, { sea: result.sea }, { hotel: result.hotel }, { fuel: result.fuel }, { grid: result.grid }, { propane: result.propane }, { total: result.totals });

    // vm.userFootprint.dataIn.push(result.plane);

  };
//Pushes user data to an array.
  vm.userData = function (user) {

    vm.userFootprint.userInfo.push({ selectedOrganization: user.selectedOrganization });

  };
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





  //This is the start of sending logged in user's info to the database.
  vm.projectOut = { userInfo: [], userType: [], dataIn: [] };



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

    var footprintIn = vm.projectOut.dataIn;
    footprintIn.push(csvIn);

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
  vm.postProjects = function () {

    $http.post('/member/project_submit', vm.projectOut).then(function(response) {

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
