


// SLICES:
//
//
// var chart1, chart2, chart3, chart4, chart5;
//
// //call if they slice by PERIOD:
// function sanitizeByPeriod(resp) {
//   var allThings = resp;
//   var cleanedThings = [];
//
//   //sanitize array of data by collapsing all rows for each period into one row:
//   cleanedThings.push(allThings[0]);
//   for (var i=1; i<allThings.length; i++) {
//     var current = allThings[i];
//     var prev = allThings[i - 1];
//     if (current.period !== prev.period) {
//       cleanedThings.push(current);
//     }
//   }
//
//   //run the carbon impact calculator for each element of cleanedThings:
//   var periods = [];
//   for (var j=0; j<cleanedThings.length; j++) {
//     periods.push(UserService.computeFootprint(cleanedThings[j]));
//   }
//
//
//   //finally, sum up the columns to find total impact for each period:
//   var totals = [], totals_period = [];
//   for (var k=0; k<periods.length; k++) {
//     var p = periods[k];
//     var total = p.air + p.car + p.freight_train + p.fuel + p.grid + p.hotel + p.plane + p.propane + p.sea + p.train + p.truck;
//     totals_period.push($filter('date')(p.period, 'MMM yyyy'));
//     totals.push(Math.round(total, 1));
//   }
//
//   //well we don't need the following 2 declarations, and we get a weird error, but it does fix the hover bug!:
//   var canvas = angular.element(document.getElementById("donutChart"));
//   canvas.remove();
//   var canvasContainer = angular.element(document.querySelector("#donutChartContainer"));
//   canvasContainer.append("<canvas id='donutChart' height=225 width=400></canvas>");
//
//   if (chart1) {
//     chart1.destroy();
//   } else if (chart2) {
//     chart2.destroy();
//   } else if (chart3) {
//     chart3.destroy();
//   } else if (chart4) {
//     chart4.destroy();
//   } else if (chart5) {
//     chart5.destroy();
//   }
//
//
//   chart1= new Chart(document.getElementById("donutChart").getContext("2d"), {
//     type: 'line',
//     data: {
//       labels: totals_period,
//       datasets: [{
//         //make an array with the sum of all categories
//         data: totals,
//         label: "Kgs of CO₂",
//         borderColor: "#3e95cd",
//         fill: false
//       }
//     ]
//   },
//   options: {
//     title: {
//       display: true,
//       text: 'Carbon Footprint Over Time'
//     }
//   }
// });
// }
//
//
//
//
//
// //call if they slice by PROJECT:
// function sanitizeByProject(resp) {
//   var allThings = resp;
//
//
//   //sanitize the data, collapsing all rows corresponding to a project into one row:
//   var cleanedThings = [];
//   cleanedThings.push(allThings[0]);
//   for (var i=1; i<allThings.length; i++) {
//     var current = allThings[i];
//     var prev = allThings[i - 1];
//     if (current.name !== prev.name) {
//       cleanedThings.push(current);
//     }
//   }
//
//
//   //run the carbon impact calculator on each project's data:
//   var projects = [];
//   for (var j=0; j<cleanedThings.length; j++) {
//     projects.push(UserService.computeFootprint(cleanedThings[j]));
//   }
//
//
//   //finally, sum up all the columns to find total footprint of each project:
//   var totals = [], totals_name = [];
//   for (var k=0; k<projects.length; k++) {
//     var p = projects[k];
//     var total = p.air + p.car + p.freight_train + p.fuel + p.grid + p.hotel + p.plane + p.propane + p.sea + p.train + p.truck;
//     totals_name.push(p.name);
//     totals.push(Math.round(total,1));
//   }
//   //the issue here is their array of projects will be indefinitely long: how do we set data equal to the proper array? Oh i guess we can split "totals" into two arrays for data and for labels.
//
//   if (chart1) {
//     chart1.destroy();
//   } else if (chart2) {
//     chart2.destroy();
//   } else if (chart3) {
//     chart3.destroy();
//   } else if (chart4) {
//     chart4.destroy();
//   } else if (chart5) {
//     chart5.destroy();
//   }
//   var canvas = angular.element(document.getElementById("donutChart"));
//   canvas.remove();
//   var canvasContainer = angular.element(document.querySelector("#donutChartContainer"));
//   canvasContainer.append("<canvas id='donutChart' height=225 width=400></canvas>");
//
//
//   chart2= new Chart(document.getElementById("donutChart").getContext("2d"), {
//     type: 'doughnut',
//     data: {
//       labels: totals_name,
//       datasets: [
//         {
//           label: "CO2",
//           backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#5F61D6", "#D6EDFF", "#D6D659", "#D7BDF2", "#89896B", "#C8931E"],
//           data: totals
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Total Footprint'
//       }
//     }
//   });
//
// }
//
//
//
//
//
//
// //call if they slice by TYPE:
// function sanitizeByType(resp) {
//   var allThings = resp;
//   var cleanedThings = [];
//   //sanitize array of data by collapsing all rows for each type into one row:
//   cleanedThings.push(allThings[0]);
//   for (var i=1; i<allThings.length; i++) {
//     var current = allThings[i];
//     var prev = allThings[i - 1];
//     if (current.type_id !== prev.type_id) {
//       cleanedThings.push(current);
//     }
//   }
//   //calculate carbon impact for each element of cleaned array:
//   var types = [];
//   for (var j=0; j<cleanedThings.length; j++) {
//     types.push(UserService.computeFootprint(cleanedThings[j]));
//   }
//
//   //finally, add up all columns to find total footprint for each type:
//   var totals = [], totals_type = [];
//   for (var k=0; k<types.length; k++) {
//     var t = types[k];
//     var total = t.air + t.car + t.freight_train + t.fuel + t.grid + t.hotel + t.plane + t.propane + t.sea + t.train + t.truck;
//     totals.push(Math.round(total,1));
//     totals_type.push(t.type_id);
//   }
//
//
//   if (chart1) {
//     chart1.destroy();
//   } else if (chart2) {
//     chart2.destroy();
//   } else if (chart3) {
//     chart3.destroy();
//   } else if (chart4) {
//     chart4.destroy();
//   } else if (chart5) {
//     chart5.destroy();
//   }
//   var canvas = angular.element(document.getElementById("donutChart"));
//   canvas.remove();
//   var canvasContainer = angular.element(document.querySelector("#donutChartContainer"));
//   canvasContainer.append("<canvas id='donutChart' height=225 width=400></canvas>");
//   chart3=new Chart(document.getElementById("donutChart").getContext("2d"), {
//     type: 'doughnut',
//     data: {
//       labels: totals_type,
//       datasets: [
//         {
//           label: "CO2",
//           backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#5F61D6", "#D6EDFF", "#D6D659", "#D7BDF2", "#89896B", "#C8931E"],
//           data: totals
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Total Footprint'
//       }
//     }
//   });
// }
//
//
//
//
// //call if they slice by COUNTRY:
// function sanitizeByCountry(resp) {
//   var allThings = resp;
//   var cleanedThings = [];
//
//   //sanitize the array of data by collating all rows for a particular country into one row:
//   cleanedThings.push(allThings[0]);
//   for (var i=1; i<allThings.length; i++) {
//     var current = allThings[i];
//     var prev = allThings[i - 1];
//     if (current.country_id !== prev.country_id) {
//       cleanedThings.push(current);
//     }
//   }
//   //run the carbon impact calculator for each country:
//   var countries = [];
//   for (var j=0; j<cleanedThings.length; j++) {
//     countries.push(UserService.computeFootprint(cleanedThings[j]));
//   }
//
//
//   //finally, sum up all the columns to find each country's total impact:
//   var totals = [], totals_country = [];
//   for (var k=0; k<countries.length; k++) {
//     var t = countries[k];
//     var total = t.air + t.car + t.freight_train + t.fuel + t.grid + t.hotel + t.plane + t.propane + t.sea + t.train + t.truck;
//     totals.push(Math.round(total,1));
//     totals_country.push(t.country_id);
//   }
//
//
//   if (chart1) {
//     chart1.destroy();
//   } else if (chart2) {
//     chart2.destroy();
//   } else if (chart3) {
//     chart3.destroy();
//   } else if (chart4) {
//     chart4.destroy();
//   } else if (chart5) {
//     chart5.destroy();
//   }
//   var canvas = angular.element(document.getElementById("donutChart"));
//   canvas.remove();
//   var canvasContainer = angular.element(document.querySelector("#donutChartContainer"));
//   canvasContainer.append("<canvas id='donutChart' height=225 width=400></canvas>");
//   chart4 = new Chart(document.getElementById("donutChart").getContext("2d"), {
//     type: 'doughnut',
//     data: {
//       labels: totals_country,
//       datasets: [
//         {
//           label: "CO2",
//           backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#5F61D6", "#D6EDFF", "#D6D659", "#D7BDF2", "#89896B", "#C8931E"],
//           data: totals
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Total Footprint'
//       }
//     }
//   });
//
// }
//
//
//
//
//
// //call if they slice by CATEGORY:
// function sanitizeByCategory(resp) {
//   var fp = UserService.computeFootprint(resp[0]);
//
//
//   //calculate totals:
//   var totals = [];
//   var living = fp.fuel + fp.hotel + fp.grid + fp.propane;
//   var shipping = fp.air + fp.truck + fp.sea + fp.freight_train;
//   var travel = fp.plane + fp.train + fp.car;
//
//   totals.push(Math.round(living, 1));
//   totals.push(Math.round(shipping, 1));
//   totals.push(Math.round(travel, 1));
//
//
//   if (chart1) {
//     chart1.destroy();
//   } else if (chart2) {
//     chart2.destroy();
//   } else if (chart3) {
//     chart3.destroy();
//   } else if (chart4) {
//     chart4.destroy();
//   } else if (chart5) {
//     chart5.destroy();
//   }
//   var canvas = angular.element(document.getElementById("donutChart"));
//   canvas.remove();
//   var canvasContainer = angular.element(document.querySelector("#donutChartContainer"));
//   canvasContainer.append("<canvas id='donutChart' height=225 width=400></canvas>");
//
//   chart5 = new Chart(document.getElementById("donutChart").getContext("2d"), {
//     type: 'doughnut',
//     data: {
//       labels: ["Living", "Travel", "Shipping"],
//       datasets: [
//         {
//           label: "CO2",
//           backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#5F61D6", "#D6EDFF", "#D6D659", "#D7BDF2", "#89896B", "#C8931E"],
//           data: [living, travel, shipping]
//         }
//       ]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'Total Footprint'
//       }
//     }
//   });
//
// }
