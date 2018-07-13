
myApp.controller('headerController', function(UserService, $location) {
  console.log('header controller created');
  var vm = this;
  vm.userService = UserService;

  vm.click = function() {
    vm.userService.getuser();
    if (vm.userService.userObject.userName) {
      $location.path('/user');
    } else {
      $location.path('/home');
    }
  };
});
