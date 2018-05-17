
myApp.controller('CalcController', function ($scope, anchorSmoothScroll, UserService, $http, $location, $anchorScroll, $timeout) {

  console.log('CalcController created');
  var vm = this;

  vm.allDone = false;

  vm.toHome = function() {
    $location.path('/home');
  };

  // almost working: the problem is we aren't clearing out userObject on logout:
  vm.userAuthenticated = UserService.userObject.userName != undefined;

  //Hmm I wonder whether ng-changes can be chained, so that changing inputs could change one output, whose change could trigger other changes. Probably!
  // NO! Thwarted! "The ng-change event is only triggered if there is a actual change in the input value, and not if the change was made from a JavaScript."
  function cleanNumber(n) {
    const str = n.toString();
    const dot = str.includes('.');
    let res = '';
    for (let i=0; i < str.length; i++) {
      const index = str.length - 1 - i;
      res = str[index] + res;
      // wow why can't i think of a better way to do this....
      if (dot) {
        if (i > 2) {
          if (i % 3 == 2 && i !== str.length - 1) {
            res = ',' + res;
          }
        }
      } else {
        if (i % 3 == 2 && i !== str.length - 1) {
          res = ',' + res;
        }
      }
    }
    // console.log(res);
    return res;
  }

  // All on the client, so this is fine:
  vm.progress = 0;

  // Inputs:
  vm.size = 400;
  vm.hours = 20;
  vm.load = 80;
  vm.costPerLiter = 1.55;
  vm.overspec = 10;
  vm.dayPower = 75;
  vm.budget = 3.25;

  vm.dailyLitersKnown = 0;

  // Submit function -- should prob just split into 4:
  vm.submit = function(prog) {
    // increment hide/show progress:
    vm.progress = prog + 1; // why am i passing an argument for this? Ah. Because we don't want user to be able to click four times on first submit button.

    // Maybe we *make* them click submit on 3 before showing values? Then we can save to DB.
    console.log(prog);

    if (prog == 1) {

      var card2 = document.getElementById('card2');
      card2.classList.add('green');

      // Ok, needs to be wrapped in $timeout.... And still not animating the scroll (sometimes??).
      $timeout(function() {
        // Hmm seems to not work when you come from Home page and try immediately. The controller reloads sometimes (?) in that case.
        // $location.hash('card3'); // Ok, this was the toxic line, awesome.
        anchorSmoothScroll.scrollTo('card3');
      });

    }

    if (prog == 2) {
      var card3 = document.getElementById('card3');
      card3.classList.add('card1');
    }

    if (prog == 3) {
      // Need to grab the data here, and hide results until click.
      var card4 = document.getElementById('card4');
      card4.classList.add('green');
      vm.allDone = true;

      data = {
        size: vm.size,
        hours: vm.hours,
        load: vm.load,
        cost: vm.costPerLiter,
        overspec: vm.overspec,
        dayPower: vm.dayPower,
        budget: vm.budget,
        userId: UserService.userObject.id,
        liters: vm.dailyLiters,
        litersKnown: vm.dailyLitersKnown // Wait, if we're already grabbing liters, we shouldn't need this. Just need to adjust SQL query.
      };

      UserService.uploadTransition(data);

    }

    var card1 = document.getElementById('card1');
    card1.classList.add("card1");
  };



  // ===========================
  // Calculations for outputs:
  // ===========================

  vm.calculateDieselUse = () => (vm.size * vm.hours * vm.load/100).toFixed(2);
  vm.calculateDailyLiters = () => (vm.dieselUsage / 15).toFixed(2);
  vm.calculateMonthlyCost = () => (30 * vm.dailyLiters * vm.costPerLiter).toFixed(2);
  vm.calculateAnnualCost = () => (vm.month * 12).toFixed(2);
  // 2.8 kg carbon per liter. 3.8 liters per gallon.
  vm.calculateCarbon = () => (vm.dailyLiters * 3.8 * 2.8 * 365).toFixed(0);

  // I'm doing the strange /25 + /500 thing because 1000 gets taken to 42.
  var sunFactor = 80; // 1000/125, by experiment
  var overspecFactor = 240; // 1000/42, by experiment
  vm.calculateSolarSize = () => ((vm.dieselUsage/25 + vm.dieselUsage/500) + ((100 - vm.dayPower)/100 * vm.dieselUsage / sunFactor) + ((vm.overspec/10) * vm.dieselUsage / overspecFactor)).toFixed(1); // ok vm.overspec/10 seems to offer most realistic results, but why on earth that rather than /100 or /1?
  vm.calculateSolarCost = () => (vm.solarSize * 1000 * vm.budget).toFixed(2);
  vm.calculateCoverTime = () => (vm.solarCost / (vm.dailyLiters * vm.costPerLiter)).toFixed(0);
  // we should just put dailyCost in its own variable but whatever
  vm.calculateSavings = (x) => ((x * 365 - vm.coverTime) * vm.dailyLiters * vm.costPerLiter).toFixed(2);


  // The real BUG is that size of solar grid is not appropriately sensitive to dayPower -- it *might* be fine for overspec.


  // ===========================
  // Handle changes to input fields:
  // ===========================


  // Ok this seems to be working as a poor-man's workaround for now:
  vm.changeDailyLitersKnown = () => {
    vm.dailyLiters = vm.dailyLitersKnown;

    // Change the future stuff.... E.g. size of needed solar grid:
    vm.dieselUsage = (15 * vm.dailyLiters).toFixed(2);
    vm.dieselUsageString = cleanNumber(vm.dieselUsage);

    vm.changeMonthlyCost();
    vm.changeSolarSize();
  };

  vm.changeDieselUse = () => {
    vm.dieselUsageString = cleanNumber(vm.calculateDieselUse());
    vm.dieselUsage = vm.calculateDieselUse();

    vm.changeDieselCost();
    vm.changeSolarSize();
  };

  vm.changeSolarSize = () => {
    vm.solarSizeString = cleanNumber(vm.calculateSolarSize());
    vm.solarSize = vm.calculateSolarSize();

    vm.changeSolarCost();
  };

  vm.changeSolarCost = () => {
    vm.solarCostString = cleanNumber(vm.calculateSolarCost());
    vm.coverTimeString = cleanNumber(vm.calculateCoverTime());
    vm.savingsString = cleanNumber(vm.calculateSavings(5));
    vm.savingsTenString = cleanNumber(vm.calculateSavings(10));

    vm.solarCost = vm.calculateSolarCost();
    vm.coverTime = vm.calculateCoverTime();
    vm.savings = vm.calculateSavings(5);
    vm.savingsTen = vm.calculateSavings(10);
  };


  // This is gallons, not liters, per day, and only a rough estimate based on the chart (http://www.dieselserviceandsupply.com/Diesel_Fuel_Consumption.aspx):
  // This should also be called when any of first 3 inputs are changed:
  vm.changeDieselCost = () => {
    vm.dailyLiters = vm.calculateDailyLiters();

    vm.changeMonthlyCost();
    vm.changeSolarCost();
  };

  vm.changeMonthlyCost = () => {
    vm.month = vm.calculateMonthlyCost();
    vm.year = vm.calculateAnnualCost();
    vm.carbon = vm.calculateCarbon();
    vm.savingsCarbon = 10 * vm.carbon;

    vm.monthString = cleanNumber(vm.calculateMonthlyCost());
    vm.yearString = cleanNumber(vm.calculateAnnualCost());
    vm.carbonString = cleanNumber(vm.calculateCarbon());
    vm.savingsCarbonString = cleanNumber(10 * vm.carbon);
  };


  // ===========================
  // Initialize outputs:
  // ===========================

  vm.dieselUsage = vm.calculateDieselUse(); // note: this is actually kWh/day
  vm.dailyLiters = vm.calculateDailyLiters(); // note: this is actually gallons/day
  vm.month = vm.calculateMonthlyCost();
  vm.year = vm.calculateAnnualCost();
  vm.solarSize = vm.calculateSolarSize();
  vm.solarCost = vm.calculateSolarCost();
  vm.carbon = vm.calculateCarbon();
  vm.coverTime = vm.calculateCoverTime();
  vm.savings = vm.calculateSavings(5);
  vm.savingsTen = vm.calculateSavings(10);
  vm.savingsCarbon = vm.carbon * 10;


  vm.dieselUsageString = cleanNumber(vm.calculateDieselUse()); // note: this is actually kWh/day
  vm.monthString = cleanNumber(vm.calculateMonthlyCost());
  vm.yearString = cleanNumber(vm.calculateAnnualCost());
  vm.solarSizeString = cleanNumber(vm.calculateSolarSize());
  vm.solarCostString = cleanNumber(vm.calculateSolarCost());
  vm.carbonString = cleanNumber(vm.calculateCarbon());
  vm.coverTimeString = cleanNumber(vm.calculateCoverTime());
  vm.savingsString = cleanNumber(vm.calculateSavings(5));
  vm.savingsTenString = cleanNumber(vm.calculateSavings(10));
  vm.savingsCarbonString = cleanNumber(vm.carbon * 10);

});
