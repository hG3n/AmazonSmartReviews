var AmazonSmartReviews = (function() {
  var init = function init() {
    d3.csv("resources/leather.csv", function(data) {
      smartModel.init(data);
      smartView.init();
      smartController.init();
    });
  };
  
  return {
    init: init
  };
})()