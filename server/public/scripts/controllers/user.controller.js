myApp.controller('UserController', function (UserService, $mdDialog, $http, $filter, donutService, $location) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.countries = UserService.countries.data;
  vm.userProjects = UserService.userProjects;
  vm.selectedIndex = UserService.userProjects.selectedIndex;
  vm.lineData = [];
  vm.sliceBy = 'abc';
  //this is for the list of user projects
  vm.showButton=false;
  vm.dashBarShow = false;
  vm.dashDonutShow = false;

  vm.dashDonut = function() {
    vm.dashBarShow = false;
    vm.dashDonutShow = true;
  };

  vm.dashBar = function() {
    vm.dashDonutShow = false;
    vm.dashBarShow = true;
  };

  vm.toCalculator = function() {
    $location.path('/calc');
  };

  // gets the data for the DASHBOARD lineChart displaying org's carbon impact
  vm.lineChart = function () {
    donutService.getUserFpDividedByPeriod().then(function (response) {
      vm.lineData = response;
      var month = '';
      var sum = 0;

      var periodArray = [];
      var sumsArray = [];
      for (var i = 0; i < vm.lineData.length; i += 1) {
        lineData = vm.lineData[i];
        sum = lineData.air + lineData.car + lineData.freight_train + lineData.fuel + lineData.grid + lineData.hotel + lineData.plane + lineData.propane + lineData.sea + lineData.train + lineData.truck;
        sumsArray.push(Math.round(sum, 1));

        month = $filter('date')(vm.lineData[i].period, 'MMM yyyy');

        periodArray.push(month);
      }

      new Chart(document.getElementById("linechart"), {
        type: 'line',
        data: {
          labels: periodArray,
          datasets: [{
            //make an array with the sum of all categories
            data: sumsArray,
            label: "Kgs of CO₂",
            borderColor: "#3e95cd",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Carbon Footprint over Time'
        }
      }
    });
  }).catch(function (error) {
    console.log(error, 'error with line graph data footprints by period');
  });
};

//gets users projects
vm.userService.getProjects(vm.userObject.id);
//dashboard dialog
vm.upload = function (ev, i) {
  // userService.getProjects.selectedIndex = i;
  $mdDialog.show({
    controller: 'DashboardDialogController as ddc',
    templateUrl: 'views/templates/dashboarddialog.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose: true

  });
}; //End modal function


//Add new project modal.
vm.newProject = function (ev, i) {

  $mdDialog.show({
    controller: 'ProjectDialogController as pdc',
    templateUrl: 'views/templates/projectdialog.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose: true

  });
};

vm.hide = function () {
  $mdDialog.hide();
};

vm.cancel = function () {
  $mdDialog.cancel();
};

vm.answer = function (answer) {

  $mdDialog.hide(answer);
};

vm.showProject = function (ev, i) {
  UserService.userProjects.selectedIndex = i;

  UserService.clickedProject = UserService.userProjects[i];
  window.location.href = '/#/projects';
};



//====================
//BARS:
//====================

vm.barBy = '';
vm.barParticular = '';
vm.barResults = [];
vm.activeSelector = '';

vm.changeBarView = function() {
  var data = {view: vm.barBy};
  $http.post('/chart/bars', data).then(function(response) {
    vm.barResults = response.data;
    //ty Chrisco:
    vm.activeSelector = vm.barBy;
  }).catch(function(err) {
    console.log(err);
  });
};

vm.submitBarQuery = function(view, particular) {
  var data = {view: view, particular: particular};
  $http.post('/chart/bars_numbers', data).then(function(response) {
    var computedFp = UserService.computeFootprint(response.data[0]);
    var bars = [];

    for (var key in computedFp) {
      bars.push(Math.round(computedFp[key], 1));
    }

    var canvas = document.getElementById("barChart");
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['air', 'truck', 'sea', 'freight train', 'plane', 'car', 'train', 'hotel', 'fuel', 'grid', 'propane'],
        datasets: [{
          //make an array with the sum of all categories
          data: bars,
          label: "Kgs of CO₂",
          borderColor: "#3e95cd",
          backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#5F61D6", "#D6EDFF", "#D6D659", "#D7BDF2", "#89896B", "#C8931E"],
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Carbon Footprint'
      }
    }
  });
}).catch(function(err) {
  console.log(err);
});
};


//====================
//DONUTS:
//====================

vm.viewBy = '';
vm.viewByObject = {};
vm.choseProj = false;
vm.activeSelectorDonut = '';
vm.donutResults = [];
vm.donutParticular = {};


//aww jeez but we're also going to have to populate the Particulars select element ....with a GET route.
vm.changeView = function() {

  let splits = ['Period', 'Project', 'Type', 'Country', 'Category'];
  const capitalized = vm.viewBy[0].toUpperCase() + vm.viewBy.substring(1, vm.viewBy.length);
  // console.log( splits.indexOf(capitalized), capitalized, splits[0]);
  const ind = splits.indexOf(capitalized);
  splits.splice(ind, 1);
  vm.choseProj = false;
  vm.viewByObject.one = splits[0];
  vm.viewByObject.two = splits[1];
  vm.viewByObject.three = splits[2];
  vm.viewByObject.four = splits[3];

  if (vm.viewBy === 'project') {
    vm.viewByObject.two = null;
    vm.viewByObject.three = null;
    vm.choseProj = true;
  }

  vm.activeSelectorDonut = vm.viewBy;
  var data = {view: vm.viewBy};

  if (vm.activeSelectorDonut != 'category') {
    $http.post('chart/bars', data).then(function(response) {
      vm.donutResults = response.data;
    }).catch(function(err) {
      console.log(err);
    });
  }
};


vm.submitQuery = function(view, particular, slice) {
  donutService.getDonut(view, particular, slice).then(function(response) {
    console.log("response: ", response, "vm.viewBy: ", vm.viewBy, "vm.sliceBy: ", vm.sliceBy, "vm.particular: ", vm.donutParticular);

    // vm.activeSelectorDonut = '';

    if (vm.viewBy == 'category') {
      viewByCategory(response.data);
      return;
    }

    sanitize(vm.sliceBy, response.data);
  });
};


var myChart;
var types = ['Health', "Food/Nutrition", "Education", 'Non-Food Items (NFI)', "Shelter", "Conflict", "Migration/Camp Management", "Faith-based", "Research", "Governance", "Business/Entrepreneur", "Donor"];



// SHOULD MOVE TH\ESE INTO SERVICE, JUST COPY PASTAING TO PROJECT CONTROLLER:
var countries = [];

function getAllCountries() {
  return $http.get('/project/countries')
    .then(res => res.data.rows.map(country => country.name)).catch(function(err) {
      console.log(err);
    });
}

getAllCountries().then(function(res) {
  // console.log(res);
  countries = res;
});

// Still should break into a few smaller functions:
function sanitize(slice, resp) {
  console.log(slice, resp);
  var totals = [];
  var chart_labels = [];

  // Special case:
  if (slice === 'Category') {
    var fp = UserService.computeFootprint(resp[0]);
    // Calculate totals:
    var living = fp.fuel + fp.hotel + fp.grid + fp.propane;
    var shipping = fp.air + fp.truck + fp.sea + fp.freight_train;
    var travel = fp.plane + fp.train + fp.car;
    totals = [living, travel, shipping];
    chart_labels = ["Living", "Travel", "Shipping"];
  } else {
    // Sanitize array of data by collapsing all rows for each SLICE into one row:
    var cleanedThings = [];
    cleanedThings.push(resp[0]);

    // Get appropriate key name:
    var keyName;
    switch(slice) {
      case 'Period': keyName = 'period'; break;
      case 'Project': keyName = 'name'; break;
      case 'Type': keyName = 'type_id'; break;
      case 'Country': keyName = 'country_id'; break;
    }

    for (var i=1; i < resp.length; i++) {
      var current = resp[i];
      var prev = resp[i - 1];
      if (current[keyName] !== prev[keyName]) {
        cleanedThings.push(current);
      }
    }

    // Run the carbon impact calculator for each element of cleanedThings:
    var results = [];
    for (var j=0; j < cleanedThings.length; j++) {
      results.push(UserService.computeFootprint(cleanedThings[j]));
    }

    // Finally, sum up the columns to find total impact for each period:
    for (var k=0; k < results.length; k++) {
      var p = results[k];
      var total = p.air + p.car + p.freight_train + p.fuel + p.grid + p.hotel + p.plane + p.propane + p.sea + p.train + p.truck;

      var label;

      switch(slice) {
        case 'Period': label = $filter('date')(p.period, 'MMM yyyy'); break;
        case 'Project': label = p.name; break;
        // Wait, we want the actual type and country names, not the IDs, for the labels!

        case 'Type':
        label = types[p.type_id];
        // var type_name = types[p.type_id];
        // console.log(type_name);
        break;

        case 'Country':
        label = countries[p.country_id];
        break;
      }

      chart_labels.push(label);
      totals.push(Math.round(total, 1));
    }
  }

  // Reset the chart and canvas:
  var canvas = angular.element(document.getElementById("donutChart"));
  canvas.remove();
  var canvasContainer = angular.element(document.querySelector("#donutChartContainer"));
  canvasContainer.append("<canvas id='donutChart' height=225 width=400></canvas>");

  if (myChart) {
    myChart.destroy();
  }

  // Prepare new chart:
  var chart_type = slice === 'Period' ? 'line' : 'doughnut';
  var border_color = slice === 'Period' ? "#3e95cd" : null;
  var background_color = slice === 'Period' ? null : ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#5F61D6", "#D6EDFF", "#D6D659", "#D7BDF2", "#89896B", "#C8931E"];
  var chart_fill = slice === 'Period' ? false : null;
  var titleBit = vm.viewBy === 'period' ? vm.donutParticular.substring(0, 10) : vm.donutParticular[0].toUpperCase() + vm.donutParticular.substring(1);
  // console.log(titleBit);
  var chart_title = vm.slice === 'Period' ? "Carbon Footprint from " + vm.donutParticular + " Over Time" : "Carbon Footprint from " + titleBit + " divided by " + slice;

  // Draw new chart:
  myChart = new Chart(document.getElementById("donutChart").getContext("2d"), {
    type: chart_type,
    data: {
      labels: chart_labels,
      datasets: [{
        data: totals,
        label: "Kgs of CO₂",
        borderColor: border_color,
        backgroundColor: background_color,
        fill: chart_fill
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: chart_title
    }
  }
});
}



//call if they view by CATEGORY:
//no there has to be a better way to do this....it's just ALL their footprints.
function viewByCategory(resp) {

  // Wait this doesn't make any sense.....
  var x = 'shipping';

  //set all NON-shipping (e.g.) columns to 0:
  for (var i=0; i<resp.length; i++) {
    var r = resp[i];
    if (x == 'living') {
      r.air=0;
      r.truck=0;
      r.sea=0;
      r.freight_train=0;
      r.plane=0;
      r.train=0;
      r.car=0;
    } else if (x == 'shipping') {
      r.fuel=0;
      r.hotel=0;
      r.grid=0;
      r.propane=0;
      r.plane=0;
      r.train=0;
      r.car=0;
    } else if (x == 'travel') {
      r.fuel=0;
      r.hotel=0;
      r.grid=0;
      r.propane=0;
      r.air=0;
      r.truck=0;
      r.sea=0;
      r.freight_train=0;
    }
  }

  //send the curated array through the proper sliceBy function:
  sanitize(vm.sliceBy, resp);
} // end viewByCategory


vm.lineChart();


vm.checkAdmin = function(){
  if(vm.userObject.id === 1){
    vm.showButton = true;
  }
};

vm.checkAdmin();

vm.navigate = function(){
  $location.path('/admin');
};


});
//end of user controller
