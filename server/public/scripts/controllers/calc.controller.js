myApp.controller('CalcController', function (UserService, $http) {
    console.log('CalcController created');
    var vm = this;


    vm.progress = 0;

    // Initialize outputs:
    // vm.dieselUsage = 0;
    // vm.dailyLiters = 0;
    // vm.month = 0;
    // vm.year = 0;
    vm.carbon = 0;
    vm.solarCost = 0;
    vm.coverTime = 0;
    vm.solarSize = 0;
    vm.savings = 0;

    // Inputs:
    vm.size = 400;
    vm.hours = 20;
    vm.load = 80;
    vm.costPerLiter = 1.55;
    vm.overspec = 10;
    vm.dayPower = 75;
    vm.budget = 3.00;

    vm.progress = 0;


    vm.submit = function(prog) {
      vm.progress = prog + 1;
    };



    // Calculations for outputs:
    vm.calculateDieselUse = () => (vm.size * (vm.hours/24) * (vm.load/100)).toFixed(2);

    vm.calculateDailyLiters = () => (24 * (vm.dieselUsage / 15)).toFixed(2);

    vm.calculateMonthlyCost = () => (30 * vm.dailyLiters * vm.costPerLiter).toFixed(2);

    vm.calculateAnnualCost = () =>(vm.month * 12).toFixed(2);

    // but we're not even accounting for the 2 percentages.
    vm.calculateSolarSize = () => (vm.dieselUsage/25 + vm.dieselUsage/500).toFixed(1);

    vm.calculateSolarCost = () => (vm.solarSize * 1000 * vm.budget).toFixed(2);

    // vm.calculateCoverTime = () => ();

    // Initialize outputs:
    vm.dieselUsage = vm.calculateDieselUse();
    vm.dailyLiters = vm.calculateDailyLiters();
    vm.month = vm.calculateMonthlyCost();
    vm.year = vm.calculateAnnualCost();
    vm.solarSize = vm.calculateSolarSize();
    vm.solarCost = vm.calculateSolarCost();

    vm.carbon = 1;


    // vm.solarSize = 100;
    // vm.solarCost = 0;
    // vm.coverTime = 0;
    vm.savings = 0;


});
