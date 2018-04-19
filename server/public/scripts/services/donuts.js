
myApp.service('donutService', function($http, $location, UserService) {
  console.log('donutService Loaded');
  // var self = this;

//amateur hour over here, i forgot to assign the crucial variable:
  var self = this;

  function curryDivisions(url) {
    return (() => {
      const type = url.includes('period') ? 'period' : 'name';
      return $http.get(url).then(function(response) {
        //because the sql query gives us rows with repeated info, we have to sanitize it, i.e. put it in a form that the compute-conversion function can eat:
        var allTheStuff = response.data;
        var cleanedStuff = [];
        //grab the first element of the array:
        cleanedStuff.push(allTheStuff[0]);

        //and then for each subsequent element, check whether its previous element has a different project name:
        for (var i=1; i<allTheStuff.length; i++) {
          var current = allTheStuff[i];
          var prev = allTheStuff[i - 1];
          if (current[type] !== prev[type]) {
            cleanedStuff.push(current);
          }
        }
        var projects = [];
        //compute the conversion to find the footprint for each project in cleanedStuff:
        for (var j=0; j<cleanedStuff.length; j++) {
          projects.push(UserService.computeFootprint(cleanedStuff[j]));
        }

        return projects;

      }).catch(function(err) {
        console.log('uh oh', err);
      });
    });
  }
  // INTERESTING, breaks if you comment out second one, but not the first one!
  self.getFpDividedByProject = curryDivisions('/member/footprint_by_project');
  self.getFpDividedByPeriod = curryDivisions('/member/footprints_footprint_by_period');
  self.getUserFpDividedByPeriod = curryDivisions('/member/footprint_by_period');

// HMM it would appear we don't have to call this....not sure why:
  // self.getFpDividedByProject();


// ?????
//testing the donut function:
  // self.getDonut = function(view, particular, slice) {
  //   if (view == 'period') {
  //     particular = particular.slice(0, 10);
  //   }
  //   var instructions = {view: view, particular: particular, slice: slice};
  //
  //   return $http.post('/member/donut/', instructions).then(function(response) {
  //
  //     return response;
  //   }).catch(function(err) {
  //     console.log(err);
  //   });
  // };

});
