
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

  self.getFpDividedByProject = curryDivisions('/member/footprint_by_project');
  self.getFpDividedByPeriod = curryDivisions('/member/footprints_footprint_by_period');
  self.getUserFpDividedByPeriod = curryDivisions('/member/footprint_by_period');



// moved all three to chart-divisions:
  self.getFpDividedByProject = function() {
    return $http.get('/member/footprint_by_project').then(function(response) {
      //because the sql query gives us rows with repeated info, we have to sanitize it, i.e. put it in a form that the compute-conversion function can eat:
      var allTheStuff = response.data;
      var cleanedStuff = [];
      //grab the first element of the array:
      cleanedStuff.push(allTheStuff[0]);

      //and then for each subsequent element, check whether its previous element has a different project name:
      for (var i=1; i<allTheStuff.length; i++) {
        var current = allTheStuff[i];
        var prev = allTheStuff[i - 1];
        if (current.name !== prev.name) {
          cleanedStuff.push(current);
        }
      }
      var projects = [];
      //compute the conversion to find the footprint for each project in cleanedStuff:
      for (var j=0; j<cleanedStuff.length; j++) {
        projects.push(UserService.computeFootprint(cleanedStuff[j]));
      }

      // why returning nothing here?????

    }).catch(function(err) {
      console.log('uh oh', err);
    });
  };

  self.getFpDividedByProject();


  self.getFpDividedByPeriod = function(userId) {
    return $http.get('/member/footprints_footprint_by_period').then(function(response) {

      var allTheStuff = response.data;
      var cleanedStuff = [];
      // grab the first element of the array:
      cleanedStuff.push(allTheStuff[0]);

      // and then for each subsequent element, check whether its previous element has a different period; if so, add it to the sanitized array:
      for (var i=1; i<allTheStuff.length; i++) {
        var current = allTheStuff[i];
        var prev = allTheStuff[i - 1];
        if (current.period !== prev.period) {
          cleanedStuff.push(current);
        }
      }

      var periods = [];
      //compute the conversion to find the footprint for each period in cleanedStuff:
      for (var j=0; j<cleanedStuff.length; j++) {
        periods.push(UserService.computeFootprint(cleanedStuff[j]));
      }

      return periods;
    }).catch(function(err) {
      console.log('uh oh', err);
    });
  };

  self.getUserFpDividedByPeriod = function () {
    return $http.get('/member/footprint_by_period').then(function (response) {

      var allTheStuff = response.data;
      var cleanedStuff = [];
      //grab the first element of the array:
      cleanedStuff.push(allTheStuff[0]);

      //and then for each subsequent element, check whether its previous element has a different period; if so, add it to the sanitized array:
      for (var i = 1; i < allTheStuff.length; i++) {
        var current = allTheStuff[i];
        var prev = allTheStuff[i - 1];
        if (current.period !== prev.period) {
          cleanedStuff.push(current);
        }
      }

      var periods = [];
      //compute the conversion to find the footprint for each period in cleanedStuff:
      for (var j = 0; j < cleanedStuff.length; j++) {
        periods.push(UserService.computeFootprint(cleanedStuff[j]));
      }


      return periods;
    }).catch(function (err) {
      console.log('uh oh', err);
    });
  };




// ?????
//testing the donut function:
  self.getDonut = function(view, particular, slice) {
    if (view == 'period') {
      particular = particular.slice(0, 10);
    }
    var instructions = {view: view, particular: particular, slice: slice};

    return $http.post('/member/donut/', instructions).then(function(response) {

      return response;
    }).catch(function(err) {
      console.log(err);
    });
  };

});
