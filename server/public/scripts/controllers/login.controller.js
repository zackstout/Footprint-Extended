myApp.controller('LoginController', function ($http, $location, $timeout, $filter, UserService, donutService, csvService, $mdDialog) {

  console.log('LoginController created');
  var vm = this;
  vm.user = {
    username: '',
    password: ''
  };

  vm.userNut = false;
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

  vm.hoverHelp = function(ev) {
    vm.showHelp = true;
  };

  vm.unhoverHelp = function(ev) {
    vm.showHelp = false;
  };

  vm.toCalculator = function() {
    $location.path('/calc');
  };

  vm.forgot = function() {
    $location.path('/forgot');
  };

  $(document).ready(function() {
    // console.log('yo');
    $('#file').change(function() {
      var f = document.getElementById('file').files[0];
      // console.log(f);
      $('#fileNameOut').html('');
      $('#fileNameOut').append(f.name);

      if (!f.name.includes('csv')) {
        $('#fileNameOut').append('&emsp;<span style="color:goldenrod;">We recommend using a CSV file.</span>');
      }
    });
  });


  // ===============================================================================================


  // OUTSOURCE TO CSV SERVICE (we use it twice)
  //This function carries out the CSV upload.
  vm.uploadFile = function (user, data) {

    // Validation:
    if ($('#orgName').val() == '') {
      $('#errorOut').html('Please enter an organization name.');
    } else if (data == undefined) {
      $('#errorOut').html('Please select metric or non-metric.');
    } else if (!document.getElementById('file').files[0]){
      $('#errorOut').html('Please upload a CSV file.');
    } else {
      var f = document.getElementById('file').files[0];
      var r = new FileReader();

      vm.getUserData(user);
      vm.dataType(data);

      r.onloadend = function (e) {
        var data = e.target.result;
        let org = $('#orgName').val(); // Hope this works

        csvService.parseData(data, org).then(function(response) {
          console.log(response);

          // Final piece of validation:
          if (response.living == 0 && response.shipping == 0 && response.travel == 0) {
            $('#errorOut').html('Sorry, we could not process your file.');
          } else {
            vm.userNut = true;
            $('#errorOut').html('');
            vm.donutDataSetTrial(response);
          }
        });
      };
      r.readAsBinaryString(f);
    }
  };

  // ===============================================================================================


  vm.user_total_kg = 0;

  // 3 chart things i haven't dug into yet:


  // Moved this to trial controller:
  //re-draws the donut graph with trial data:
  vm.donutDataSetTrial = function(x){
    vm.donutResult = x;
    // var ctx = document.getElementById('userDonut').getContext('2d');
    // ctx.fillText('hi THERE YOU SILLY GOOSE ARE YOU THERE CAN YOU SEE ME', 0, 150, 150);


    new Chart(document.getElementById("userDonut"), {
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
    vm.user_total_kg = cleanNumber((x.living + x.shipping + x.travel).toFixed(2));
  };


  // ===============================================================================================


  function cleanNumber(n) {
    const str = n.toString();
    const dot = str.includes('.');
    let res = '';
    for (let i=0; i < str.length; i++) {
      const index = str.length - 1 - i;
      res = str[index] + res;
      // wow why can't i think of a better way to do this....
      if (dot) {
        if (i > 2) {
          if (i % 3 == 2 && i !== str.length - 1) {
            res = ',' + res;
          }
        }
      } else {
        if (i % 3 == 2 && i !== str.length - 1) {
          res = ',' + res;
        }
      }
    }
    return res;
  }


  // ===============================================================================================


  vm.total_kg = 0;
  // Moved these 2 to FPFP controller:

  // start doughnut
  vm.donutDataSet = function(){
    UserService.getFootprintsFootprint().then(function(response){
      vm.donutResult = response;
      let living = response.living;
      let shipping = response.shipping;
      let travel = response.travel;

      new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Living", "Travel", "Shipping"],
          datasets: [
            {
              label: "Kgs of CO₂",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
              data: [Math.round(living, 1), Math.round(travel, 1), Math.round(shipping, 1)]
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

      vm.total_kg = cleanNumber((living + shipping + travel).toFixed(2));

    });
  };

  vm.donutDataSet();


  // ===============================================================================================


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


// NOTE: Controller sometimes loads when there is no data for this:
vm.lineChart();


// ===============================================================================================


// Moving to Auth controller:
vm.login = function() {
  console.log('LoginController -- login');
  if(vm.user.username === '' || vm.user.password === '') {
    $mdDialog.show({
      templateUrl: '/views/templates/alerts/noUser.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    });
    // vm.message = "Enter your username and password!";
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
        $mdDialog.show({
          templateUrl: '/views/templates/alerts/incorrect.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
    }).catch(function(response){
      console.log('LoginController -- registerUser -- failure: ', response);
      vm.message = "Please try again!";
      $mdDialog.show({
        templateUrl: '/views/templates/alerts/incorrect.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });
    });
  }
};

vm.registerUser = function() {
  console.log('LoginController -- registerUser');
  if(vm.user.username === '' || vm.user.password === '') {
    // vm.message = "Choose a username and password!";
    $mdDialog.show({
      templateUrl: '/views/templates/alerts/noInfo.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    });
  } else {
    // console.log('LoginController -- registerUser -- sending to server...', vm.user);
    $http.post('/register', vm.user).then(function(response) {
      // console.log('LoginController -- registerUser -- success');
      $location.path('/home');
    }).catch(function(response) {
      // console.log('LoginController -- registerUser -- error');
      $mdDialog.show({
        templateUrl: '/views/templates/alerts/noInfo.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });
      // vm.message = "Please try again.";
    });
  }
};


// ===============================================================================================


vm.contactModal = function (ev, i) {
  // userService.getProjects.selectedIndex = i;
  $mdDialog.show({
    controller: 'contactController as cc',
    templateUrl: 'views/templates/contact.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose: true,
    //  scope: $scope // **** the magic line **** // Well, actually the line that breaks the nav bar. Shoot.
  });
};


// ??????? (same as with DDC, what is going on here??) -- all three functions are called from Submit click...
//This function will get the user Data from the DOM
vm.getUserData = function(user) {

  csvService.userData(user);

};


vm.dataType = function(data) {

  csvService.dataType = data;
  vm.hide = true;
};

}); //End login controller
