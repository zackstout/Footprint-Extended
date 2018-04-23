
myApp.controller('CalcController', function (anchorSmoothScroll, UserService, $http, $location, $anchorScroll, $timeout) {
    console.log('CalcController created');
    var vm = this;

    vm.toHome = function() {
      $location.path('/home');
    };

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
      return res;
    }


    console.log(cleanNumber(12434));

    // going to have to fix this, probably (multiple users problem):
    vm.progress = 0;

    // Inputs:
    vm.size = 400;
    vm.hours = 20;
    vm.load = 80;
    vm.costPerLiter = 1.55;
    vm.overspec = 10;
    vm.dayPower = 75;
    vm.budget = 3.25;

    // We're going to have to attach this to each user's session -- but they have't even logged in yet... Do we force them to?
    vm.progress = 0;

    // Submit function -- should prob just split into 4:
    vm.submit = function(prog) {
      // increment hide/show progress:
      // is this going to break if multiple users doing it at once? Probably.
      vm.progress = prog + 1;

      //update values of outputs -- Or maybe this is unnecessary given the ng-changes?:
      vm.dailyLiters = vm.calculateDailyLiters();

      // Maybe we *make* them click submit on 3 before showing values? Then we can save to DB.
      console.log(prog);

      if (prog == 1) {

        var card2 = document.getElementById('card2');
        card2.classList.add('green');

        // Ok, needs to be wrapped in $timeout.... And still not animating the scroll.
        $timeout(function() {
          // Hmm seems to not work when you come from Home page and try immediately.
          $location.hash('card3');
          anchorSmoothScroll.scrollTo('card3');
        });

      }

      if (prog == 2) {
        var card3 = document.getElementById('card3');
        card3.classList.add('card1');
      }

      if (prog == 3) {
        // we'll need to grab the data here, and hide results until click.
        var card4 = document.getElementById('card4');
        card4.classList.add('green');
      }

      var card1 = document.getElementById('card1');
      card1.classList.add("card1");
    };

    // ===========================
    // Calculations for outputs:
    // ===========================

    vm.calculateDieselUse = () => (vm.size * vm.hours * vm.load/100).toFixed(2); // Oh big mistake, *don't* divide by 24. Because we want kWh/day.
    vm.calculateDailyLiters = () => (vm.dieselUsage / 15).toFixed(2); // Also *don't* multiply by 24 here.
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


    // BUG: if gas costs more, the time to cover costs should always get higher, no matter what. bUt that is not occuring. NO! That's false! If the cost increases, we'd expect it to pay itself back FASTER. Duh.
    // The real BUG is that size of solar grid is not appropriately sensitive to dayPower -- it *might* be fine for overspec.


    // ===========================
    // Handle changes to input fields:
    // ===========================

    vm.changeDieselUse = () => {
      vm.dieselUsage = vm.calculateDieselUse();
      // or do we want to call change functions.... yeah.
      // vm.dailyLiters = vm.calculateDailyLiters();
      // vm.solarSize = vm.calculateSolarSize();
      vm.changeDailyLiters();
      vm.changeSolarSize();

    };

    vm.changeSolarSize = () => {
      vm.solarSize = vm.calculateSolarSize();
      vm.changeSolarCost();
    };

    vm.changeSolarCost = () => {
      vm.solarCost = vm.calculateSolarCost();
      vm.coverTime = vm.calculateCoverTime();
      vm.savings = vm.calculateSavings(5);
    };

    vm.changeDailyLiters = () => {
      vm.dailyLiters = vm.calculateDailyLiters();
      vm.changeMonthlyCost();
      vm.changeSolarCost();
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

});
