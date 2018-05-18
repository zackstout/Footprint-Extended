myApp.controller('LoginController', function ($http, $location, $timeout, $filter, UserService, donutService, csvService, $mdDialog) {

  console.log('LoginController created');
  var vm = this;
  vm.user = {
    username: '',
    password: ''
  };
  vm.message = '';
  vm.UserService = UserService;
  vm.months = UserService.months;
  vm.countries = UserService.countries.data;
  vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
  vm.years = [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];
  vm.items = ['Health', 'Food/Nutrition', 'Education', 'Non-Food Items (NFI)', 'Shelter', 'Conflict', 'Migration/Camp Management', 'Faith-based', 'Research', 'Governance', 'Business/Entrepeneur', 'Donor'];
  vm.selected = [];
  vm.userFootprint = csvService.userFootprint;
  vm.lineData = [];
  vm.hide = false;
  vm.showHelp = false;

  // var icon = document.getElementById('helpIcon');
  // console.log(icon);

  vm.hoverHelp = function(ev) {
    // console.log(ev);
    vm.showHelp = true;
  };

  vm.unhoverHelp = function(ev) {
    // console.log(ev);
    vm.showHelp = false;
  };

  vm.toCalculator = function() {
    $location.path('/calc');
  };


  // OUTSOURCE TO CSV SERVICE ()
  //This function carries out the CSV upload.
  vm.uploadFile = function () {

    var f = document.getElementById('file').files[0];
    var r = new FileReader();
    r.onloadend = function (e) {
      var data = e.target.result;
      //  No, call it from within the service itself:
      // csvService.masterParse(data).then(function(response) {
      //   console.log("LC: ", response);
      // });

      csvService.parseData(data).then(function(response) {

        // Ahh here's the call:
        console.log(response);
        vm.donutDataSetTrial(response);
      });
    };
    r.readAsBinaryString(f);

  };



  vm.ExcelToJSON = function() {
    var f = document.getElementById('file').files[0];

    // this.parseExcel = function(file) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var data = reader.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });

        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          var json_object = JSON.stringify(XL_row_object);
          console.log(json_object);

        });

      };

      reader.onerror = function(ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(f);
    };
  // };









  // 3 chart things i haven't dug into yet:


// Moved this to trial controller:
    //re-draws the donut graph with trial data:
    vm.donutDataSetTrial = function(x){
      vm.donutResult = x;

      new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Living", "Travel", "Shipping"],
          datasets: [
            {
              label: "Kgs of CO₂",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
              // why not just use x?
              data: [Math.round(vm.donutResult.living, 1), Math.round(vm.donutResult.travel, 1), Math.round(vm.donutResult.shipping,1)]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Total Footprint by Category'
          }
        }
      });

    };




// Moved these 2 to FPFP controller:

  // start doughnut
  vm.donutDataSet = function(){
    UserService.getFootprintsFootprint().then(function(response){
      vm.donutResult = response;

      new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Living", "Travel", "Shipping"],
          datasets: [
            {
              label: "Kgs of CO₂",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
              data: [Math.round(vm.donutResult.living, 1), Math.round(vm.donutResult.travel, 1), Math.round(vm.donutResult.shipping, 1)]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Total Kgs of CO₂ by Category'
          }
        }
      });
    });
  };


  vm.donutDataSet();

  // gets the data for the landing page lineChart displaying footprints carbon impact
  vm.lineChart = function(){
    donutService.getFpDividedByPeriod(1).then(function(response){
      vm.lineData = response;
      var month = '';
      var sum = 0;

      var periodArray = [];
      var sumsArray = [];
      for (var i=0; i<vm.lineData.length; i+=1){
        lineData = vm.lineData[i];
        sum = lineData.air + lineData.car + lineData.freight_train + lineData.fuel + lineData.grid + lineData.hotel + lineData.plane + lineData.propane + lineData.sea + lineData.train + lineData.truck;
        sumsArray.push(Math.round(sum,1));

        month = $filter('date')(vm.lineData[i].period, 'MMM yyyy');

        periodArray.push(month);

      }
      new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: periodArray,
          datasets: [{
            //make an array with the sum of all categories
            data: sumsArray,
            label: "Kgs of CO₂",
            borderColor: "#3e95cd",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Carbon Footprint over Time'
        }
      }
    });
  }).catch(function (error) {
    console.log(error, 'error with line graph data footprints by period');
  });
};
vm.lineChart();










// Moving to Auth controller:
vm.login = function() {
  console.log('LoginController -- login');
  if(vm.user.username === '' || vm.user.password === '') {
    vm.message = "Enter your username and password!";
  } else {
    // console.log('LoginController -- login -- sending to server...', vm.user);
    $http.post('/', vm.user).then(function(response) {
      if(response.data.username) {
        // console.log('LoginController -- login -- success: ', response.data);
        // location works with SPA (ng-route)
        if (response.data.id != 1){
          $location.path('/user'); // http://localhost:5000/#/user
        } else {
          $location.path('/admin');
        }
      } else {
        console.log('LoginController -- login -- failure: ', response);
        vm.message = "Please try again!";
      }
    }).catch(function(response){
      console.log('LoginController -- registerUser -- failure: ', response);
      vm.message = "Please try again!";
    });
  }
};

vm.registerUser = function() {
  console.log('LoginController -- registerUser');
  if(vm.user.username === '' || vm.user.password === '') {
    vm.message = "Choose a username and password!";
  } else {
    // console.log('LoginController -- registerUser -- sending to server...', vm.user);
    $http.post('/register', vm.user).then(function(response) {
      // console.log('LoginController -- registerUser -- success');
      $location.path('/home');
    }).catch(function(response) {
      // console.log('LoginController -- registerUser -- error');
      vm.message = "Please try again.";
    });
  }
};




// ??????? (same as with DDC, what is going on here??)
//This function will get the user Data from the DOM
vm.getUserData = function(user) {

  csvService.userData(user);

};


vm.dataType = function(data) {

  csvService.dataType = data;
  vm.hide = true;
};

}); //End login controller
