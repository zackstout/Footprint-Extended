
myApp.service('transitionService', function($http, $location, UserService) {
  console.log('transitionService Loaded');

  var self = this;

  // we will inject this into calcController, and userController and homeController, to keep track of whether user is logged in.
  // Wait, we can just check if user is logged in..... (?)
  // Yeah, this is unnecessary.



});
