myApp.service('CsvService2', function ($http, $location, UserService) {
  console.log('csvService2 Loaded');

  var vm = this;

  vm.dataType = '';

  vm.uploadFile = function () {
    var f = document.getElementById('file').files[0];
    var r = new FileReader();
    r.onloadend = function (e) {
      var data = e.target.result;

      csvService.parseData(data).then(function(response) {
        vm.donutDataSetTrial(response);
      });
    };
    r.readAsBinaryString(f);
  };


  //This function parses the data from uploaded CSVs.
  vm.parseData = function (data) {
    var dataNums = data.slice(data.lastIndexOf('kWh'), data.indexOf(',,,,,,,,,,'));
    var arrayOfNums = dataNums.split(',');

    // moving in here:
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


// WAIT, THIS IS WRONG, not using constants:
    if (vm.dataType.type === 'English') {
      // for (var i=0; i<csv.length; i++){
      csv.plane = Math.round((csv.plane * 1.609344));
      csv.car = Math.round((csv.car * 1.609344));
      csv.train_travel = Math.round((csv.train_travel * 1.609344));
      csv.air = Math.round((csv.air * 1.460));
      csv.train_shipping = Math.round((csv.train_shipping * 1.460));
      csv.truck = Math.round((csv.truck * 1.460));
      csv.sea = Math.round((csv.sea * 1.460));

      // WHY NO CHANGES TO LIVING ???
    }

    csv.organization = (vm.userFootprint.userInfo[0].selectedOrganization);

    vm.valuesToArray(csv);

    vm.trialData = UserService.computeTrialFootprint(csv);

    return $http.post('/admin', csv).then(function (response) {

      return vm.trialData;
      //how odd that it logs out all as 0s here but posts into the DB ok....asynchonicity man.
    }).catch(function (err) {
      console.log('whooooops', err);
    });
  }; // end parseData

  //Change the CSV values to an array.
  vm.valuesToArray = function (obj) {
    var result = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push(obj[key]);
      }
    }

    // NOTE: DO NOT USE THIS, USE FUNCTION IN FOOTPRINTS SERVICE:
    vm.calculations(result);
  };
});
