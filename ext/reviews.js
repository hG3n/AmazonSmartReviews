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

var setupDependencies = function() {
  var head = document.getElementsByTagName("head");
  script = document.createElement("script");
  script.src = "http://d3js.org/d3.v3.min.js";
  script.charset = "utf-8";
  head[0].appendChild(script);
}

var setupStructure = function() {
  // clear the review div
  var reviewDiv = document.getElementById("cm_cr_dpwidget");
  reviewDiv.innerHTML = "";

  // create div for header and further informations
  var header = document.createElement("div");
  header.className = "smartHeader";
  reviewDiv.appendChild(header);

  // create div for review visualisation
  var reviewBars = document.createElement("div");
  reviewBars.className = "smartReviews";
  reviewDiv.appendChild(reviewBars);
}

var initSmartReviews = function() {
  
  // TODO: fix d3 include - currently not working
  var smartReviewSVG = d3.select(".smartReviews")
                         .append("svg")
                         .attr("width", w)
                         .attr("height", h+10);
}

setupDependencies();
setupStructure();

//initSmartReviews();




