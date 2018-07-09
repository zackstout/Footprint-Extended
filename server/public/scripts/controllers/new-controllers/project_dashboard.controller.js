myApp.controller('ProjectDashboardController', function() {
    console.log('ProjectDashboardController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.countries = UserService.countries.data;
    vm.userProjects = UserService.userProjects;
    vm.selectedIndex = UserService.userProjects.selectedIndex;
    vm.clickedProject = UserService.clickedProject;
    vm.projectFootprints = [];
    vm.userObj = UserService.userObj;

    //gets the footprints for selected project
    vm.getProjectFootprints = function (id) {

        UserService.getProjectFootprints(id, false).then(function(response){
            vm.projectFootprints = UserService.selectedProjectFootprints;

            //add alert for catch
        }).catch(function (error) {
            console.log(error, 'error getting footprints for selected project');
        });
    };

    //for page load
    vm.getProjectFootprints(vm.clickedProject.id);

    // click function for selecting project to view
    vm.changeSelected = function(){
        vm.clickedProject = UserService.clickedProject;
    };

    //function for displaying selected project
    vm.showSelected = function() {

        vm.changeSelected();
        vm.getProjectFootprints(vm.clickedProject.id);
    };
    vm.showSelected();

    //this is for when the project is selected from projects page instead of from dashboard
    vm.showAnotherProject = function (ev, i) {
        UserService.userProjects.selectedIndex = i;

        vm.clickedProject = UserService.userProjects[i];
        vm.getProjectFootprints(vm.clickedProject.id);

    };

    //Opens edit dialog box.
    vm.editModal = function(event, index) {
        vm.userService.userObj.selectedIndex = index;

        $mdDialog.show({
            // changing this:
            controller: 'ProjectEditController as pec',
            templateUrl: '/views/templates/projecteditdialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true
        });
    };//End edit dialog box function.

    vm.deleteModal = function (event, index) {
        vm.userService.userObj.selectedIndex = index;

        $mdDialog.show({
            // changing this:
            controller: 'ProjectDeleteController as pc',
            templateUrl: '/views/templates/deleteconfirmdialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true
        });
    };

    vm.hide = function(){
        $mdDialog.hide();
    };

});
