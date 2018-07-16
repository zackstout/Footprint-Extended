
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
      console.log("project", vm.user.project);
      UserService.getProjectIdFromNamePure(vm.user.project).then(result => {
        console.log(result);

        if (result.data.rows.length > 0) {
          // Need to do some validation here. That's what gave rise to the refactoring and the weird csvService is not defined error.
        }
        const project_id = result.data.rows[0].id;

        UserService.getProjectFootprints(project_id).then(res => {
          // console.log(res, vm.user.selectedMonth, vm.user.selectedYear);

          // Convert to proper date format:
          let month_index = (vm.months.indexOf(vm.user.selectedMonth) + 1).toString(); // Odd we had to coerce to string..
          if (month_index.length == 1) month_index = '0' + month_index;

          let date = `${vm.user.selectedYear}-${month_index}`;

          let usedAlready = false;
          res.forEach(fp => {
            if (fp.period.includes(date)) usedAlready = true;
          });

          console.log(date, usedAlready);

          if (usedAlready) {
            $('#errorOutput').html("You've already uploaded a footprint for that month.");
          } else {

            var f = document.getElementById('file').files[0];
            var r = new FileReader();

            handleUpload(vm.user, vm.data, f, r);

          }
        });
      });

    }
  };  //End CSV upload




  function handleUpload(user, data, file, reader) {
    csvService.sendUser(user);
    csvService.dataType = data;
    $mdDialog.hide();
    $('#errorOutput').html('');

    reader.onloadend = function (e) {
      var data = e.target.result;

      csvService.parseFootprint(data).then(function(res) {

        console.log(data, res, loc, UserService.clickedProject, vm.user.project);
        // WELL what I'm tempted to do is write function to get project where project.name = $1 and then REQUIRE unique project names...Otherwise have to store ID in the dropdown, it seems.

        if (loc === 'project') {
          //   // This refreshes the page user is looking at. Would probably be better to direct to new Project and then refresh *its* footprints:
          UserService.getProjectIdFromName(vm.user.project).then(res => {
            console.log(UserService.clickedProject); // this has the data we need.

          });
        } else {
          // We want to refresh the chart
          console.log('chart get yo ass goin');
          // let drawNewChart = function() {
          //   console.log('les go');
          // };
          // UserService.registerObserverCallback(drawNewChart);
          UserService.drawNewChart();
        }
      });
    };

    reader.readAsBinaryString(file);

  }



}); //End Dialog controller
