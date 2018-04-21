myApp.controller('CalcController', function (UserService, $http) {
    console.log('CalcController created');
    var vm = this;



    // Inputs:
    vm.size = 40;
    vm.hours = 20;
    vm.load = 80;

    vm.costPerLiter = 1.55;

    vm.overspec = 10;
    vm.dayPower = 75;

    vm.budget = 3.00;

    // Outputs:
    vm.dieselUsage = (vm.size * (vm.hours/24) * (vm.load/100)).toFixed(2);

    // not yet correct, this is only rough estimate of gallons/hr:
    vm.dailyLiters = (24 * (vm.dieselUsage / 15)).toFixed(2);

    vm.month = (30 * vm.dailyLiters * vm.costPerLiter).toFixed(2);

    vm.year = (vm.month * 12).toFixed(2);



    vm.carbon = 1;


    vm.solarSize = 100;
    vm.solarCost = 0;
    vm.coverTime = 0;
    vm.savings = 0;


});
