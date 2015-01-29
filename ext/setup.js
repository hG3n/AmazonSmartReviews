var setup_structure = function() {
  // clear the review div

  var clear_div = document.getElementById("purchase-similarities_feature_div");
  clear_div.innerHTML = "";
  clear_div = document.getElementById("buyxgety_feature_div");
  clear_div.innerHTML = "";
  clear_div = document.getElementById("promotions_feature_div");
  clear_div.innerHTML = "";
  clear_div = document.getElementById("product-description_feature_div");
  clear_div.innerHTML = "";
  //clear_div = document.getElementById("product-details-grid_feature_div");
  //clear_div.innerHTML = "";
  clear_div = document.getElementById("conditional-probability_feature_div");
  clear_div.innerHTML = "";
  clear_div = document.getElementById("ask-btf_feature_div");
  clear_div.innerHTML = "";
  clear_div = document.getElementById("revDivider");
  clear_div.innerHTML = "";

  // clear old comments
  var review_div = document.getElementById("cm_cr_dpwidget");
  review_div.innerHTML = "";

  // create div for header and further informations
  var header = document.createElement("div");
  header.className = "smart_header";
  review_div.appendChild(header);

  // create div for review visualisation
  var review_visu = document.createElement("div");
  review_visu.className = "smart_visu";
  review_div.appendChild(review_visu);

  // create div for review text
  var review_text = document.createElement("div");
  review_text.className = "smart_textbox";
  review_text.style.height = "300px";
  review_div.appendChild(review_text);
  var review_info = document.createElement("div");
  review_info.className = "smart_text";
  review_text.appendChild(review_info);
}
setup_structure();
console.log("setup finished!");
