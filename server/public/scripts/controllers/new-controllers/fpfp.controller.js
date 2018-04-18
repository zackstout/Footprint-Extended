
myApp.controller('FpfpController', function ($http, $location, $timeout, $filter, UserService, donutService, csvService, $mdDialog) {



    // start doughnut
    vm.donutDataSet = function(){
      UserService.getFootprintsFootprint().then(function(response){
        vm.donutResult = response;

        new Chart(document.getElementById("doughnut-chart"), {
          type: 'doughnut',
          data: {
            labels: ["Living", "Travel", "Shipping"],
            datasets: [
              {
                label: "Kgs of CO₂",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
                data: [Math.round(vm.donutResult.living, 1), Math.round(vm.donutResult.travel, 1), Math.round(vm.donutResult.shipping, 1)]
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Total Kgs of CO₂ by Category'
            }
          }
        });
      });
    };


    vm.donutDataSet();

    // gets the data for the landing page lineChart displaying footprints carbon impact
    vm.lineChart = function(){
      donutService.getFpDividedByPeriod(1).then(function(response){
        vm.lineData = response;
        var month = '';
        var sum = 0;

        var periodArray = [];
        var sumsArray = [];
        for (var i=0; i<vm.lineData.length; i+=1){
          lineData = vm.lineData[i];
          sum = lineData.air + lineData.car + lineData.freight_train + lineData.fuel + lineData.grid + lineData.hotel + lineData.plane + lineData.propane + lineData.sea + lineData.train + lineData.truck;
          sumsArray.push(Math.round(sum,1));

          month = $filter('date')(vm.lineData[i].period, 'MMM yyyy');

          periodArray.push(month);

        }
        new Chart(document.getElementById("line-chart"), {
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
  vm.lineChart();



});
