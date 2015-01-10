var AmazonSmartReviews = (function() {
  var init = function init() {
    d3.csv("resources/leather.csv", function(data) {
      smartModel.init(data);
      smartView.init(50); //720,480,50
      //MV_View.init(1280,720,50);
      smartController.init();
    });
  };
  
  return {
    init: init
  };
})()