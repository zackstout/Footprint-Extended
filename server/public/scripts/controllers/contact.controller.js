
myApp.controller('contactController', function ($mdDialog, $http) {
  let vm = this;
  vm.contactError = '';
  vm.name = '';
  vm.email = '';
  vm.subject = '';
  vm.message = '';

  vm.hide = function() {
    $mdDialog.hide();
  };

  vm.submitContact = function() {
    if (vm.name == '' || vm.email == '' || vm.subject == '' || vm.message == '') {
      vm.contactError = 'Please fill out all fields.';
    } else {
      vm.contactError = '';
      vm.messageInfo = {
        name: vm.name,
        email: vm.email,
        subject: vm.subject,
        message: vm.message
      };

      $mdDialog.show({
        templateUrl: '/views/templates/alerts/contactSuccess.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });

      // Using this router because has the nodemailer stuff:
      $http.post('/forgot/contact', vm.messageInfo)
        .then(res => {
          console.log(res);

        })
        .catch(err => console.log(err));
    }
  };
});
