myApp.controller('projecteditdcontroller', function ($http, UserService, csvService, $mdDialog, $interval) {
  var vm = this;
  vm.userService = UserService;
  vm.userObj = UserService.userObj;
  console.log('project edit controller created');
  vm.projects = [];


  vm.hide = function() {
    $mdDialog.hide();
  };

  //This gets the user info into the controller
  vm.populateProjects = function (userObj) {
    var index = vm.userObj.selectedIndex;
    vm.projects = UserService.selectedProjectFootprints[index];
  };

  vm.populateProjects();

  // ===============================================================================================


  //Submit the CSV data.
  vm.submitData = function () {

    var file = document.getElementById('file').files[0];
    var result = new FileReader();
    result.onloadend = function (e) {
      var data = {data: e.target.result};
      data.project = vm.projects;

      // changing this to clean up services:
      var parsed = csvService.masterParse(data.data);

      UserService.sendEdits(data, parsed);
    };
    result.readAsBinaryString(file);

  };  //End CSV upload


});//This is the end of the project edit controller
