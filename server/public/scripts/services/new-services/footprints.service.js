myApp.service('FootprintService', function ($http, $location, UserService) {
  console.log('FPService Loaded');

  var self = this;

  const PLANE_CONVERSION = 0.18026;
  const CAR_CONVERSION = 0.18568;
  const TRAIN_CONVERSION = 0.01225;
  const AIR_CONVERSION = 1.45648;
  const FREIGHT_CONVERSION = 2.60016;
  const TRUCK_CONVERSION = 0.10559;
  const SEA_CONVERSION = 0.008979;
  const HOTEL_CONVERSION = 31.1;
  const FUEL_CONVERSION = 2.60016;
  const GRID_CONVERSION = 0.35156;
  const PROPANE_CONVERSION = 0.1864;

  const MI_TO_KM = 1.609344;
  const TON_MI_TO_TONNE_KM = 1.460;


  self.checkMeasure = function() {
    if (vm.dataType.type === 'English') {
      // for (var i=0; i<csv.length; i++){
      csv.plane = Math.round((csv.plane * MI_TO_KM));
      csv.car = Math.round((csv.car * MI_TO_KM));
      csv.train_travel = Math.round((csv.train_travel * MI_TO_KM));
      csv.air = Math.round((csv.air * TON_MI_TO_TONNE_KM));
      csv.train_shipping = Math.round((csv.train_shipping * TON_MI_TO_TONNE_KM));
      csv.truck = Math.round((csv.truck * TON_MI_TO_TONNE_KM));
      csv.sea = Math.round((csv.sea * TON_MI_TO_TONNE_KM));
      // so we pushed it onto this array just to grab it here??
      csv.organization = (vm.userFootprint.userInfo[0].selectedOrganization);

    } else {
      csv.organization = (vm.userFootprint.userInfo[0].selectedOrganization);

    }
  };


  //gets the footprints for selected project
  self.getProjectFootprints = function (id){

    return $http.get('/member/project_footprints/'+ id).then(function (response) {

// Wait, what??? Where is this from?
      return self.selectedProjectFootprints = response.data.rows;
    }).catch(function (err) {
      console.log('problem getting project footprints', err);
    });
  };


  self.computeFootprint = function(footprint) {
    // console.log(footprint);
    var result = {};
    result.plane = PLANE_CONVERSION * parseInt(footprint.plane);
    result.car = CAR_CONVERSION * parseInt(footprint.car);
    result.train = TRAIN_CONVERSION * parseInt(footprint.train);
    result.air = AIR_CONVERSION * parseInt(footprint.air);
    result.freight_train = FREIGHT_CONVERSION * parseInt(footprint.freight_train);
    result.truck = TRUCK_CONVERSION * parseInt(footprint.truck);
    result.sea = SEA_CONVERSION * parseInt(footprint.sea);
    result.hotel = HOTEL_CONVERSION * parseInt(footprint.hotel);
    result.fuel = FUEL_CONVERSION * parseInt(footprint.fuel);
    result.grid = GRID_CONVERSION * parseInt(footprint.grid);
    result.propane = PROPANE_CONVERSION * parseInt(footprint.propane);
    result.period = footprint.period;
    result.name = footprint.name;
    result.type_id = footprint.type_id;
    result.country_id = footprint.country_id;
    result.organization = footprint.organization;
    // console.log(result);
    return result;
  };

  self.groupByCategory = function(footprint) {
    var result = {};
    // console.log(footprint);
    result.living = footprint.hotel + footprint.fuel + footprint.grid + footprint.propane;
    result.shipping = footprint.sea + footprint.air + footprint.truck + footprint.freight_train;
    result.travel = footprint.plane + footprint.train + footprint.car;
    self.result = result;
    // console.log(self.result);
    return self.result;
  };





});
