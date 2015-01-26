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


function initSmartReviews() {
  
  var svg_container = d3.select(".smartReviews")
                         .append("svg")
                         .attr("width", w)
                         .attr("height", h+10);

  d3.csv("prototypComments.csv", function(error,data){
    if(error) {
      console.log(error);
    } else {
      review_data = data;
      review_data.forEach(function(d) {
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
        width_sum += vote_sum_scale(d.vote_sum);
      });

      var screen_scale = d3.scale.linear()          // scales values into screen size
        .domain([0,width_sum])
        .range([1,w]);

      var current_width = 0;
      review_data.forEach(function(d,i) {
        mapped_width = screen_scale(d.vote_sum)
        rect_data.push({id: d.id, 
                        width: mapped_width,
                        x: curWidth,
                        rating: d.rating,
        current_width += mapped_width;
      });
    }
  });
}

function draw() {
  var review_rects = svg_container.selectAll("rect")
    .data(rect_data)
    .enter()
    .append("rect");

  var color_scale = d3.scale.linear()
    .domain
  review_rects.attr("id", function(d,i) { return "r" + i; })
    .attr("x", function(d,i) { return rect_data[i].x })
    .attr("y", 0)
    .attr("width", function(d,i) { return rect_data[i].width })
    .attr("height", h)
    .attr("stroke", "white")
    .attr("fill", function(d) {return colScl(d.helpAvg);})
            .on("mouseover",  function(d,i) {
              if(showPara != 2){
                if (showPara == 3){
                barSVG.select("#r"+parseInt(activeId))
                   .transition()
                   .duration(100)
                   .attr("fill", colScl(dataset[activeId].helpAvg));
                }
                showPara = 1;
                activeId = d.id;
              
                var rectX = findByID(posArray,i).x;
                var width = findByID(posArray,i).width;
                var x1 = parseFloat(rectX)+parseFloat(width/2);
                showInfo(textBox,rectX);
                
                barSVG.select("#r"+parseInt(d.id))
                    .transition()
                    .duration(100)
                    .attr("fill", "#66CCFF");

                barSVG.select("#p")
                      .transition()
                      .duration(100)
                      .style("fill", "#66CCFF")
                      .style("stroke", "#66CCFF")
                      .attr("points",(x1+","+50+","+(x1-10)+","+60+","+(x1+10)+","+60) );
                      
                barSVGh.select("#b"+i)
                     .transition()
                     .duration(150)
                     .style("fill","#66CCFF");
}


initSmartReviews();
console.log("foo")
