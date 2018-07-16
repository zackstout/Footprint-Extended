
myApp.controller('FootprintUploadController', function ($http, UserService, csvService, $mdDialog, $interval, $scope, $location) {
  console.log('DashboardDialogController created', UserService.clickedProject); // why is this only being set for the first one???
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.months = UserService.months;
  vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
  vm.years = [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];

  vm.userProjects = [];
  vm.user = {};
  vm.data = {};

  vm.hide = function() {
    $mdDialog.hide();
  };

  // Check whether activated from Dashboard or Project page:
  let loc = $location.$$url == '/user' ? 'user' : 'project';

  // ===============================================================================================

  // OUTSOURCE TO PROJECTS SERVICE ?
  vm.getUserProjects = function() {
    $http.get('/project/allprojects').then(function(response) {

      vm.userProjects = response.data;
    }).catch(function(err) {
      console.log(err);
    });
  };

  vm.getUserProjects();

  // ===============================================================================================

  $(document).ready(() => {
    $('#file').change(() => {
      var f = document.getElementById('file').files[0];
      // console.log(f);
      $('#fileName').html('');
      $('#fileName').append(f.name);

      if (!f.name.includes('csv')) {
        $('#fileName').append('&emsp;<span style="color:goldenrod;">We recommend using a CSV file.</span>');
      }
    });
  });

  // ===============================================================================================

  // OUTSOURCE TO CSV SERVICE (copied from LC)
  //This function carries out the CSV upload.
  vm.uploadFile = function () {

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

      // Final piece of validation:
      UserService.getProjectFootprints(vm.user.project.id).then(res => {
        console.log(res);
        let usedAlready = true;
        res.forEach(fp => {
          console.log(fp);
          // if (proj.name == vm.user.projectName) {
          //   usedAlready = true;
          // }
        });
        if (usedAlready) {
          $('#errorOutput').html("That project name is already in use.");
        } else {
          csvService.sendUser(vm.user);
          csvService.dataType = vm.data;
          $mdDialog.hide();
          console.log(vm.data.type);
          $('#errorOutput').html('');

          var f = document.getElementById('file').files[0];
          var r = new FileReader();

          r.onloadend = function (e) {
            var data = e.target.result;

            csvService.parseFootprint(data).then(function(res) {

              console.log(data, res, loc, UserService.clickedProject, vm.user.project);
              // WELL what I'm tempted to do is write function to get project where project.name = $1 and then REQUIRE unique project names...Otherwise have to store ID in the dropdown, it seems.

              if (loc === 'project') {
                //   // This refreshes the page user is looking at. Would probably be better to direct to new Project and then refresh *its* footprints:
                UserService.getProjectIdFromName(vm.user.project).then(res => {
                  console.log(UserService.clickedProject); // this has the data we need.

                });
              }
            });
          };
          r.readAsBinaryString(f);

        }
      });




    }
  };  //End CSV upload
}); //End Dialog controller
