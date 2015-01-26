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

var setupAWS = function() {
  
}

setupStructure();
console.log("setup finished!");
