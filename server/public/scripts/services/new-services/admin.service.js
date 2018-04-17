myApp.service('csvService', function ($http, $location, UserService) {
  console.log('csvService Loaded');

  var vm = this;


  self.adminGetUsers = function () {
    // console.log('Getting users for admin');
    return $http.get('admin/users').then(function(response) {
      // console.log(response.data);
      self.users = response.data;
      return self.users;
      // console.log('users for admin', self.users);
    }).catch(function (err) {
      console.log('problem getting all users for admin', err);
    });
  };

  
});
