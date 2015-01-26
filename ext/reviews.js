// ---------------------------- //
// --- AMAZON SMART REVIEWS --- //
// ---------------------------- //
// ----- Authors: ------------- //
// ----- Hagen Hiller --------- //
// ----- Ephraim Schott ------- //
// ---------------------------- //

// global variables 
var padding = 50
var w = window.innerWidth - padding;
var h = 50;
var reviews = [];
var minVotesSum, maxVotesSum;

var initSmartReviews = function() {
  
  var smartReviewSVG = d3.select(".smartReviews")
                         .append("svg")
                         .attr("width", w)
                         .attr("height", h+10);

  d3.csv("prototypComments.csv", function(error,data){
        if(error) {
          console.log(error);
        } else {
          reviews = data;
          reviews.forEach(function(d) {
            d["votesDown"] = (d.votesAll - d.votesUp);
            d["votesSum"] = (d.votesUp - d.votesDown);
          });

          minVotesSum = d3.min(data,function(d) {         
            return parseInt(d.votesSum);
          });
          maxVotesSum = d3.max(data,function(d) {
            return parseInt(d.votesSum)
          });

          var votesSumScale = d3.scale.linear()           // rates reviews from 1 to 10
            .domain([minVotesSum,maxVotesSum])            // depending on max and min votesSum of all
            .range([1,10]);

          reviews.forEach(function(d) {                   // 
            widthSum += votesSumScale(d.votesSum);        //
          });

          var screenScale = d3.scale.linear()
            .domain([0,widthSum])
            .range([1,w]);

          reviews.forEach(function(d,i) {
            posArray.push({id: d.id, 
                           width: mapToScreen(d.helpAvg),
                           x: curWidth,
                           stars: ((d.rating*1000)+(mapTo(d.helpAvg))+(d.id/1000)),
                           rating: d.rating,
                           date: timeFormat.parse(d.date) });
            curWidth += mapToScreen(d.helpAvg);
          });

          var setupData = [];
          setupData = setup(dataset);

          draw(dataset,posArray,setupData,sortArray);

          //////////////////////
        }
      });
}

initSmartReviews();
console.log("foo")
