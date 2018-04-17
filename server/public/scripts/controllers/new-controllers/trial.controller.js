myApp.controller('LoginController', function ($http, $location, $timeout, $filter, UserService, donutService, csvService, $mdDialog) {

  //re-draws the donut graph with trial data:
  vm.donutDataSetTrial = function(x){
    vm.donutResult = x;

    new Chart(document.getElementById("doughnut-chart"), {
      type: 'doughnut',
      data: {
        labels: ["Living", "Travel", "Shipping"],
        datasets: [
          {
            label: "Kgs of CO₂",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            // why not just use x?
            data: [Math.round(vm.donutResult.living, 1), Math.round(vm.donutResult.travel, 1), Math.round(vm.donutResult.shipping,1)]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Total Footprint by Category'
        }
      }
    });

  };

});
