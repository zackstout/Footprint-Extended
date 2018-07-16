
myApp.controller('footerController', function () {
  let vm = this;
  vm.hoverFb = false;

  vm.click = function() {
    // vm.userService.getuser();
    // if (vm.userService.userObject.userName) {
    //   $location.path('/user');
    // } else {
    //   $location.path('/home');
    // }
    window.location.href = "https://www.footprintproject.org/";
  };
});
