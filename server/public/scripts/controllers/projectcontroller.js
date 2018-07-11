myApp.controller('ProjectDialogController', function (UserService, csvService, $mdDialog, $interval, $location) {
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.countries = UserService.countries.data;
    vm.items = ['Health', 'Food/Nutrition', 'Education', 'Non-Food Items (NFI)', 'Shelter', 'Conflict', 'Migration/Camp Management', 'Faith-based', 'Research', 'Governance', 'Business/Entrepeneur', 'Donor'];
    vm.selected = [];
    vm.user = {}; // Initialize empty object for modelling


    // Check where we came from:
    let loc = $location.$$url == '/user' ? 'user' : 'project';


    // Handle checkboxes:
    vm.change = function (item, active) {
        if (active) {
            vm.selected.push(item);
            var data = item;
        } else {
            vm.selected.splice(vm.selected.indexOf(item), 1);
        }
    };

    vm.submitProject = function() {
      // Validation:
      if (!vm.user.projectName) {
        $('#error').html("Please enter a project name.");
      } else if (!vm.user.selectedCountry) {
        $('#error').html("Please select a country.");
      } else if (vm.selected.length == 0) {
        $('#error').html("Please select a type.");
      }
      else {
        // UserService.newProject = true;
        vm.userService.countryIn = vm.selected;
        vm.userService.sendProject(vm.user);
        $mdDialog.hide();

        // this is already called by sendProject:
        // UserService.getProjects().then(function() {
        //   window.location.href = '/#/projects';
        //
        // });
        // vm.userService.newProject = true;
      }
    };

});
