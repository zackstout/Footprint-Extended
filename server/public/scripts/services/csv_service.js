myApp.service('csvService', function ($http, $location, UserService) {
  console.log('csvService Loaded');

  var vm = this;
  vm.userFootprint = { userInfo: [], userType: [], dataIn: [] };

  vm.dataType = '';

  // Should include an "is-metric" property:
  vm.masterParse = function(data) {
    // console.log(ExcelToJSON(data));
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

    // Must be a clever way to condense this...Loop through keys of csv object? Would need index of the key...
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

    return csv;
  };










  // (1) TRIAL DATA:
  //This function parses the data from uploaded CSVs.
  vm.parseData = function (data, org) {
    // var dataNums = data.slice(data.lastIndexOf('kWh'), data.indexOf(',,,,,,,,,,'));
    // var arrayOfNums = dataNums.split(',');

    // good this works:
    var csv = this.masterParse(data);
    console.log("parse Data 1: ", csv); // an object whose properties are values for each category -- contains both train, freight_train and train_travel, train_shipping -- why???

    if (vm.dataType.type === 'English') {
      // just mutating directly, not the best practice:
      UserService.changeToImperial(csv);
    }

    // so we pushed it onto this array just to grab it here??
    // csv.organization = vm.userFootprint.userInfo[0].selectedOrganization;

    console.log("data is......", data);
    csv.organization = org;

    // GOAL: COMPUTE THE FOOTPRINT SO WE CAN SAVE IT TO THE DATABASE:
    vm.trialData = UserService.computeTrialFootprint(csv);

    return $http.post('/admin2', csv).then(function (response) {
      // WHY ARE WE RETURNING THIS?????? ASYNC??
      return vm.trialData;
      //how odd that it logs out all as 0s here but posts into the DB ok....asynchonicity man.
    }).catch(function (err) {
      console.log('whooooops', err);
    });
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







  // (2) LOGGED IN USER's UPLOAD:
  //This is the start of sending logged in user's info to the database.
  vm.projectOut = { userInfo: [], userType: [], dataIn: [] };

  // GOAL: POST A FOOTPRINT TO THE DATABASE. USE THESE 3 FUNCTIONS TO ASSEMBLE PROJECT OBJECT.
  vm.parseFootprint = function (data) {

    var csvIn = this.masterParse(data);

    // Mutate it directly:
    if (vm.dataType.type === 'English') {
      UserService.changeToImperial(csvIn);
    }

    vm.projectOut.dataIn.push(csvIn);
    // IT OCCURS TO ME IT'S ONLY SHOWING IT NULL BECAUSE IT UPDATES AFTER IT HAS POSTED, SO IT'S EMPTY. CHECK THE DB.
    // console.log("parseFootprint 2: ", vm.projectOut);

    return vm.postProjects(vm.projectOut);
  };


  //Push info to object.
  vm.sendUser = function (user) {
    vm.projectOut.userInfo.push({ selectedMonth: user.selectedMonth }, { selectedYear: user.selectedYear }, { project: user.project });
  };

  //Project function.
  vm.projectChecks = function (sendData) {
    vm.projectOut.userType = sendData;
  };



  // Post new FP to DB:
  vm.postProjects = function (proj) {
    console.log('postin', proj);
    return $http.post('/footprints/project_submit', proj).then(function (response) {

      vm.projectOut.userInfo = [];
      vm.projectOut.userType = [];
      vm.projectOut.dataIn = [];
    }).catch(function (error) {
      console.log('error adding projects', error);
    });
  };


}); //End CSV service.
