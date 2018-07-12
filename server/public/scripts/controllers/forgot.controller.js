
myApp.controller('forgotController', function (UserService, $location, $http) {

  console.log('forgot');

  let vm = this;

  vm.user = '';
  vm.email = '';
  vm.email2 = '';
  vm.errorMsg = '';

  vm.subForgot = function() {
    // Validation:
    if (vm.user == '' || vm.email1 == '' || vm.email2 == '') {
      vm.errorMsg = "Please fill out all fields.";

    } else if (vm.email1 != vm.email2) {
      vm.errorMsg = "Emails do not match.";
    } else {
      vm.errorMsg = '';
      console.log(vm.user, vm.email1);

      // We should go through a service but who cares!
      $http.post('/user/forgot', {
        user: vm.user,
        email: vm.email1
      }).then(function(res) {
        console.log(res);
      }).catch(function(err) {
        console.log(err);
      });

      // Send this to server. If user does not exist, return error.
      // Otherwise, generate random string, P. Then hash it. Add it, along with expiration, to the database (new table?).
      // Use node-mailer to send this string to the email address, as a link.
      // When the API route is pinged with that exact string -- hashed -- (so we'll have a global array of live strings), let the user enter a new password.
    }
  };
});
