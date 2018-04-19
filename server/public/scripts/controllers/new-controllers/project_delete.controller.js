myApp.controller('ProjectDeleteController', function (UserService, $http) {


    vm.deleteThis = function(ev, x) {


        var confirm = $mdDialog.confirm()
        .clickOutsideToClose(true)
        .title("Are you sure?")
        .targetEvent(ev)
        .ok('Delete it!')
        .cancel("No, go back!");
  
        $mdDialog.show(confirm).then(function() {
  
  
          $http.delete('/member/delete/' + x).then(function(response) {
  
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
