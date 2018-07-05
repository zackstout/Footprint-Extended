myApp.controller('FootprintUploadController', function ($http, UserService, csvService, $mdDialog, $interval, $scope) {
  console.log('DashboardDialogController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  // vm.countries = UserService.countries.data;
  vm.months = UserService.months;
  // vm.countries = UserService.countries.data;
  vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
  vm.years = [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];

  vm.userProjects = [];

  vm.user = {};
  vm.data = {};



  // OUTSOURCE TO PROJECTS SERVICE ?
  vm.getUserProjects = function() {
    $http.get('/project/allprojects').then(function(response) {

      vm.userProjects = response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };


  vm.getUserProjects();


  $(document).ready(() => {
    $('#file').change(() => {
      var f = document.getElementById('file').files[0];
      // console.log(f);
      $('#fileName').html('');
      $('#fileName').append(f.name);
    });
  });


  // OUTSOURCE TO CSV SERVICE (copied from LC)
  //This function carries out the CSV upload.
  vm.uploadFile = function () {
    // console.log(user);

    // console.log(vm.user);

    // Validation:
    if (!vm.user.project) {
      $('#errorOutput').html('Please select a project.');
    } else if (!vm.user.selectedMonth) {
      $('#errorOutput').html('Please select a month.');
    } else if (!vm.user.selectedYear) {
      $('#errorOutput').html('Please select a year.');
    } else if (!vm.data.type) {
      $('#errorOutput').html('Please select metric or non-metric.');
    } else if (!document.getElementById('file').files[0]){
      $('#errorOutput').html('Please select a file.');
    } else {

      csvService.sendUser(vm.user);
      csvService.dataType = vm.data;
      $mdDialog.hide();
      $('#errorOutput').html('');

      var f = document.getElementById('file').files[0];
      var r = new FileReader();

      r.onloadend = function (e) {

        var data = e.target.result;

        // console.log(UserService.clickedProject);
        // console.log(UserService.getProjectFootprints(UserService.clickedProject.id));

        csvService.parseFootprint(data).then(function(res) {
          // console.log(res);
          // console.log($scope, scope);
          UserService.getProjectFootprints(UserService.clickedProject.id).then(function(res) {
            console.log(res);
            // vm.userProjects = res;

          });
          // csvService.updateFootprints();
          // $scope.$emit('submitFootprint', 'hi');
          // console.log($scope);
          // scope.pc.getProjectFootprints();

        });
      };
      r.readAsBinaryString(f);

    }


  };  //End CSV upload


}); //End Dialog controller
