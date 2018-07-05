myApp.service('ProjectService', function ($http, $location, UserService) {
  console.log('projectService Loaded');

  var vm = this;

    self.getCountries = function() {

      $http.get('/project/countries').then(function(response) {
        var countries = response.data.rows;

        self.countries.data = countries;

      });
    };
    self.getCountries();


    //gets the users projects for the projects view
    self.getProjects = function (id) {

      return $http.get('member/userprojects/' + id).then(function (response) {

        // What?????
        return self.userProjects = response.data;
        self.selectedProjectFootprints = response.data;

      }).catch(function (err) {
        console.log('problem getting projects', err);
      });
    };



    //Post route to send projects to the router.
      vm.postProjects = function () {

        $http.post('/member/project_submit', vm.projectOut).then(function(response) {

          csvIn = {
            plane: 0,
            car: 0,
            train_travel: 0,
            air: 0,
            train_shipping: 0,
            truck: 0,
            sea: 0,
            hotel: 0,
            fuel: 0,
            grid: 0,
            propane: 0
          };
          vm.projectOut.userInfo = [];
          vm.projectOut.userType = [];
          vm.projectOut.dataIn = [];
        }).catch(function (error) {
          console.log('error adding projects', error);
        });
      };


      self.sendProject = function(user){
        var project = user;
        project.project = self.countryIn;

        $http.post('/project/newproject', project).then(function(response) {

          self.getProjects();
        }).catch(function(error) {
          console.log(error);
        });
     };

});
