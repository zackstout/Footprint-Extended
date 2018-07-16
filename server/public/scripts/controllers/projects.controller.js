
myApp.controller('ProjectController', function ($http, UserService, csvService, $mdDialog, $interval, $scope) {
  console.log('ProjectController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.countries = UserService.countries.data;
  vm.userProjects = UserService.userProjects;
  vm.selectedIndex = UserService.userProjects.selectedIndex;
  vm.clickedProject = UserService.clickedProject;
  vm.projectFootprints = []; // This controls what appears. How do we update it based on an event from the Footprint Upload controller, whose parent is the User controller??
  vm.userObj = UserService.userObj;

  var types = ['Health', "Food/Nutrition", "Education", 'Non-Food Items (NFI)', "Shelter", "Conflict", "Migration/Camp Management", "Faith-based", "Research", "Governance", "Business/Entrepreneur", "Donor"];


  // Put service in charge of updating vm.projectFootprints: (called whenver notifyObservers is called, yes?)
  let newProject = function() {
    vm.userProjects = UserService.userProjects;
    vm.clickedProject = UserService.clickedProject;
    vm.projectFootprints = UserService.selectedProjectFootprints;

    // NOTE: ONLY doing this stuff if we've just submitted a new FOOTPRINT:
    if (vm.clickedProject.typeIds) {
      vm.clickedProject.names = vm.clickedProject.typeIds.map(id => types[id - 1]);
      vm.clickedProject.country = countries[vm.clickedProject.country_id];
      console.log(vm.clickedProject);
    }

  };

  UserService.registerObserverCallback(newProject);


  // ===============================================================================================


  // Gets the footprints for selected project
  vm.getProjectFootprints = function (id) {
    console.log('projecjt controller getting for id', id);
    UserService.getProjectFootprints(id).then(function(response){
      vm.projectFootprints = UserService.selectedProjectFootprints;
    }).catch(function (error) {
      console.log(error, 'error getting footprints for selected project');
    });
  };



  // ===============================================================================================


  // To get country and types for display:
  var countries = [];

  function getAllCountries() {
    return $http.get('/project/countries')
    .then(res => res.data.rows.map(country => country.name)).catch(function(err) {
      console.log(err);
    });
  }

  // called on ng-init
  vm.init = function() {
    getAllCountries().then(function(res) {
      countries = res;

      // We're off by one: this should be the fix:
      countries.unshift(0);
      vm.clickedProject.country = countries[vm.clickedProject.country_id];
    });
  };

  // ===============================================================================================

  // click function for selecting project to view
  vm.changeSelected = function() {
    vm.clickedProject = UserService.clickedProject;
  };

  //function for displaying selected project
  vm.showSelected = function() {
    vm.changeSelected();
    vm.getProjectFootprints(vm.clickedProject.id);
    vm.clickedProject.country = countries[vm.clickedProject.country_id];
  };

  // Ohh that may have been the problem. Loading in *this* controller for the Nav triggered this code every time.
  vm.showSelected();


  // ===============================================================================================


  //this is for when the project is selected from projects page instead of from dashboard
  vm.showAnotherProject = function (ev, i) {
    UserService.userProjects.selectedIndex = i;

    // Ahh, this was issue, we were changing vm.clickedProject instead of UserService.clickedProject.....:
    // Not sure why we need *both* here, and only one in User controller.. (when we click a Project from Dashboard).
    vm.clickedProject = UserService.userProjects[i];
    UserService.clickedProject = UserService.userProjects[i];


    console.log('hi there', vm.clickedProject); // this is correct
    vm.getProjectFootprints(vm.clickedProject.id);
    vm.clickedProject.country = countries[vm.clickedProject.country_id];
  };


  // ===============================================================================================


  //Opens edit dialog box.
  vm.editModal = function(event, index) {
    vm.userService.userObj.selectedIndex = index;

    $mdDialog.show({
      controller: 'projecteditdcontroller as pec',
      templateUrl: '/views/templates/projecteditdialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true
    });
  };

  vm.deleteModal = function (event, index) {
    vm.userService.userObj.selectedIndex = index;

    $mdDialog.show({
      controller: 'ProjectController as pc',
      templateUrl: '/views/templates/deleteconfirmdialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true
    });
  };

  vm.hide = function(){
    $mdDialog.hide();
  };


  // ===============================================================================================


  // CHANGE COLORS HERE (need this custom object hack):
  vm.deleteThis = function(ev, x) {

    var confirm = $mdDialog.confirm({
      // thanks SO <3:

      onComplete: function afterShowAnimation() {
        var $dialog = angular.element(document.querySelector('md-dialog'));
        var $actionsSection = $dialog.find('md-dialog-actions');
        var $cancelButton = $actionsSection.children()[0];
        var $confirmButton = $actionsSection.children()[1];
        angular.element($confirmButton).addClass('md-raised md-warn');
        angular.element($cancelButton).addClass('md-raised');
      }
    })
    .clickOutsideToClose(true)
    .title("Are you sure?")
    .targetEvent(ev)
    .ok('Delete it!')
    .cancel("No, go back!");


    $mdDialog.show(confirm).then(function() {

      $http.delete('/footprints/delete/' + x).then(function(response) {

        for (var i=0; i<vm.projectFootprints.length; i++) {
          var fp = vm.projectFootprints[i];
          if (fp.id == x) {
            vm.projectFootprints.splice(i, 1);
          }
        }

      }).catch(function(err) {
        console.log(err);
      });
    }, function() {
      console.log('hi there');
    });

  };


  // ===============================================================================================

  // vm.air = 0;
  // vm.sea = 0;
  // vm.truck = 0;
  // vm.freight_train = 0;
  // vm.hotel = 0;
  // vm.grid =0;
  // vm.fuel=0;
  // vm.propane =0;
  // vm.plane =0;
  // vm.car=0;
  // vm.train=0;

  vm.hovering = false;

  vm.hoverFootprint = function(ev) {
    vm.hovering = true;
    var id = ev.target.parentElement.id;
    var real_id = parseInt(id.slice(id.indexOf('_') + 1));
    // console.log(real_id);

    if (!isNaN(real_id)) {
      // UserService.getFootprint(real_id).then(footprint => {
      //   // console.log(footprint);
      //   vm.air = footprint.data.rows[0].air;
      //   vm.sea = footprint.data.rows[0].sea;
      //   vm.truck = footprint.data.rows[0].truck;
      //   vm.freight_train = footprint.data.rows[0].freight_train;
      //   vm.hotel = footprint.data.rows[0].hotel;
      //   vm.grid =footprint.data.rows[0].grid;
      //   vm.fuel=footprint.data.rows[0].fuel;
      //   vm.propane =footprint.data.rows[0].propane;
      //   vm.plane =footprint.data.rows[0].plane;
      //   vm.car=footprint.data.rows[0].car;
      //   vm.train=footprint.data.rows[0].train;
      // });

    }
  };

});
