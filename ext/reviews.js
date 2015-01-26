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
var review_data = [];
var rect_data = [];
var min_vote_sum, max_vote_sum;
var width_sum = 0;
var svg_container = d3.select(".smartReviews")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h + 10);

function mapToScreen(val) {
        var m = d3.scale.linear()
                  .domain([0,totalWidth])
                  .range([1,w-correct]);
        return m(mapTo(val));
      }

      function mapTo(val) {
        var s = d3.scale.linear()
                  .domain([minHelpAvg,maxHelpAvg])
                  .range([1,10]);
        return s(val);
      }

function initSmartReviews() {
  console.log("init reviews");
  d3.csv("http://webuser.uni-weimar.de/~senu8384/test2.csv", function(error,data){
    if(error) {
      console.log(error);
    } else {
      review_data = data;
      review_data.forEach(function(d) {
        d.vote_all = parseInt(d.vote_all);
        d.vote_up  = parseInt(d.vote_up);
        d["vote_down"] = (d.vote_all - d.vote_up);
        d["vote_sum"] =  (d.vote_up - d.vote_down);
      });

      min_vote_sum = d3.min(data,function(d) {         
        return parseInt(d.vote_sum);
      });
      max_vote_sum = d3.max(data,function(d) {

        return parseInt(d.vote_sum)
      });
      var vote_sum_scale = d3.scale.linear()        // rates reviews from 1 to 10
        .domain([min_vote_sum,max_vote_sum])        // depending on max and min vote_sum of all
        .range([1,10]);

      review_data.forEach(function(d) {             // calc width of all rects
        console.log("object:",d);
        width_sum += parseFloat(vote_sum_scale(d.vote_sum));
        console.log(vote_sum_scale(d.vote_sum));
      });

      var screen_scale = d3.scale.linear()          // scales values into screen size
        .domain([0,width_sum])
        .range([1,w]);

      var current_width = 0;
      review_data.forEach(function(d,i) {
        mapped_width = parseInt(screen_scale(vote_sum_scale(d.vote_sum)));
        rect_data.push({id: d.id, 
                        width: mapped_width,
                        x: current_width,
                        vote_sum: d.vote_sum,
                        rating: d.rating});
        current_width += mapped_width;
      });
      draw(rect_data,svg_container)
    }
  });
}

function draw(data,svg) {
  var rects = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect");

  var color_scale = d3.scale.linear()
    .domain([1,5])
    .range(["lightgray","gold"]);

  rects.attr("id", function(d,i) { return "r" + i; })
    .attr("x", function(d,i) { return rect_data[i].x })
    .attr("y", 0)
    .attr("width", function(d,i) { return rect_data[i].width })
    .attr("height", h)
    .attr("stroke", "white")
    .attr("fill", function(d) {return color_scale(d.rating);})
    .on("mouseover",  function(d,i) {
      svg.select("#r"+parseInt(d.id))
        .transition()
        .duration(100)
        .attr("fill", "#66CCFF");
    })
    .on("mouseout",function (d,i) {
      svg.select("#r"+parseInt(d.id))
        .transition()
        .duration(100)
        .attr("fill", color_scale(d.rating));
    });
  }

initSmartReviews();

console.log("Created reviews");
