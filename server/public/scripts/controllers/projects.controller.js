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

  // $scope.$on('submitFootprint', function(ev, args) {
  //   // console.log('grabbed it', args, ev);
  //   vm.getProjectFootprints(UserService.clickedProject.id);
  // });


  // Put service in charge of updating vm.projectFootprints:
  let updateProjFootprints = function() {
    vm.projectFootprints = UserService.selectedProjectFootprints;
    // console.log('hey here we are', vm.projectFootprints, vm.clickedProject);
    if (UserService.successfulUpload) {
      console.log('whwwawa');
      vm.clickedProject = UserService.clickedProject;

      $mdDialog.show({
        templateUrl: 'views/templates/uploadSuccess.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        //  scope: $scope // **** the magic line **** // Well, actually the line that breaks the nav bar. Shoot.
      });

      UserService.successfulUpload = false;
    }
  };

  UserService.registerObserverCallback(updateProjFootprints);
  // UserService.registerObserverCallback(goodUpload);



  vm.hoverFootprint = function(ev) {
    // console.log(ev.target.parentElement.id);
    var id = ev.target.parentElement.id;
    var real_id = parseInt(id.slice(id.indexOf('_') + 1));
    // console.log(real_id);

    if (!isNaN(real_id)) {
      UserService.getFootprint(real_id);
    }
  };

  // Gets the footprints for selected project
  vm.getProjectFootprints = function (id) {
    // UserService.newProject = false;

    UserService.getProjectFootprints(id).then(function(response){
      vm.projectFootprints = UserService.selectedProjectFootprints;
      // console.log(vm.projectFootprints);
      //add alert for catch
    }).catch(function (error) {
      console.log(error, 'error getting footprints for selected project');
    });
  };


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
      // console.log(res);
      countries = res;

      // We're off by one: this should be the fix:
      countries.unshift(0);
      console.log("COUNTRIES 1", countries);

      vm.clickedProject.country = countries[vm.clickedProject.country_id];

    });
  };


  console.log("COUNTRIES 2", countries);




  // viewNewProj();





  // click function for selecting project to view
  vm.changeSelected = function() {
    vm.clickedProject = UserService.clickedProject;

    console.log("HEY I'M THE PROJECT", vm.clickedProject);
    // viewNewProj();
  };

  //function for displaying selected project
  vm.showSelected = function() {

    vm.changeSelected();
    vm.getProjectFootprints(vm.clickedProject.id);
    vm.clickedProject.country = countries[vm.clickedProject.country_id];

  };

  // Ohh that may have been the problem. Loading in *this* controller for the Nav triggered this code every time.
  vm.showSelected();




  //this is for when the project is selected from projects page instead of from dashboard
  vm.showAnotherProject = function (ev, i) {
    UserService.userProjects.selectedIndex = i;

    vm.clickedProject = UserService.userProjects[i];
    vm.getProjectFootprints(vm.clickedProject.id);
    vm.clickedProject.country = countries[vm.clickedProject.country_id];


  };

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
  };//End edit dialog box function.

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


  // CHANGE COLORS HERE (need this custom object hack):
  vm.deleteThis = function(ev, x) {
    // $mdThemingProvider('warn');

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

});
