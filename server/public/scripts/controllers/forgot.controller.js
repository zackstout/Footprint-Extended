
myApp.controller('forgotController', function (UserService, $location, $http, $mdDialog) {

  console.log('forgot');

  let vm = this;

  vm.email1 = '';
  vm.email2 = '';
  vm.errorMsg = '';

  vm.password1 = '';
  vm.password2 = '';
  vm.errorMsgNew = '';

  // how do we know what user it is?
  vm.subNewPassword = function() {
    if (vm.password1 == '' || vm.password2 == '') {
      vm.errorMsgNew = "Please fill out all fields.";
    } else if (vm.password1 != vm.password2) {
      vm.errorMsgNew = "Passwords do not match.";
    } else {
      // console.log('location is ', $location);
      let data = {
        password: vm.password1,
        secret_code: $location.$$url.substring($location.$$url.lastIndexOf('/') + 1)
      };

      console.log(data);
      $http.post('/forgot/newPassword', data)
        .then(res => {
          console.log(res);
          $mdDialog.show({
            templateUrl: '/views/templates/alerts/new_password_success.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
          });
        })
        .catch(err => console.log(err));
    }
  };




  vm.subForgot = function() {
    // Validation:
    if (vm.email1 == '' || vm.email2 == '') {
      vm.errorMsg = "Please fill out all fields.";

    } else if (vm.email1 != vm.email2) {
      vm.errorMsg = "Emails do not match.";
    } else {
      vm.errorMsg = '';
      console.log(vm.email1);

      // We should go through a service but who cares!
      $http.post('/forgot/initiate', {
        email: vm.email1
      }).then(function(res) {
        // console.log(res);
        // console.log(res.statusCode);
        if (res.data == 'No user') {
          $mdDialog.show({
            templateUrl: '/views/templates/alerts/no_user_forgot.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
          });
        } else {
          $mdDialog.show({
            templateUrl: '/views/templates/alerts/user_forgot_success.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
          });
        }
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
