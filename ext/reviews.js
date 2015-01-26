// ---------------------------- //
// --- AMAZON SMART REVIEWS --- //
// ---------------------------- //
// ----- Authors: ------------- //
// ----- Hagen Hiller --------- //
// ----- Ephraim Schott ------- //
// ---------------------------- //

// global variables 
var w = window.innerWidth - 50;
var h = 50;

var initSmartReviews = function() {
  
  // TODO: fix d3 include - currently not working
  var smartReviewSVG = d3.select(".smartReviews")
                         .append("svg")
                         .attr("width", w)
                         .attr("height", h+10);
}

initSmartReviews();
console.log("foo")
