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
var visu_container = d3.select(".smart_visu")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h + 10);
var pointer = visu_container.append("polygon")
                            .attr("id","pointer");

function init_reviews() {
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
        width_sum += parseFloat(vote_sum_scale(d.vote_sum));
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
    }
    draw(rect_data,visu_container);
  });
}

function draw(data,visu_svg) {
  var rects = visu_svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect");

  var color_scale = d3.scale.linear()
    .domain([min_vote_sum,max_vote_sum])
    .range(["lightgray","green"]);

  rects.attr("id", function(d,i) { return "r" + i; })
    .attr("x", function(d,i) { return rect_data[i].x })
    .attr("y", 0)
    .attr("width", function(d,i) { return rect_data[i].width })
    .attr("height", h)
    .attr("stroke", "white")
    .attr("fill", function(d) {return color_scale(d.vote_sum);})
    .on("mouseover",  function(d,i) {
      visu_svg.select("#r"+parseInt(d.id))
        .transition()
        .duration(100)
        .attr("fill", "#44AADD");
      draw_pointer(rect_data[d.id]);
      draw_text(review_data,rect_data[d.id]);
    })
    .on("mouseout",function (d,i) {
      visu_svg.select("#r"+parseInt(d.id))
        .transition()
        .duration(100)
        .attr("fill", color_scale(d.vote_sum));
      //delete_pointer();
      //delete_text(d.id);
    });
  }

function draw_pointer(rect){
  var rect_pos = rect.x + (rect.width / 2);
  visu_container.select("#pointer")
      .style("display", "initial")
      .transition()
      .duration(100)
      .style("fill", "#66CCFF")
      .style("stroke", "#66CCFF")
      .attr("points",rect_pos+","+h+","+(rect_pos-10)+","+(h+10)+","+(rect_pos+10)+","+(h+10) );
}

function delete_pointer(){
  visu_container.select("#pointer")
      .style("display", "none")
}


function draw_text(data,rect){
  var text_width = 400;
  var text_height = 300;
  var text_x = 0;
  d3.select(".smart_text")
    .style("display","block")
    .style("width",text_width+"px")
    .style("height",text_height+"px")
    .style("background-color", "#66CCFF")
    .style("overflow-y","auto")
    .text("ID: "+data[rect.id].id + " - " +
          data[rect.id].info_text);

  // align textbox under the middle of his corresponding rect
  var rect_pos = rect.x + (rect.width / 2);
  if (rect_pos >= w - (text_width/2))
    text_x = w - text_width;
  else if( rect_pos - (text_width/2) < 0)
    text_x = 0;
  else
    text_x = rect_pos - (text_width/2);
  d3.select(".smart_text")
    .transition()
    .duration(200)
    .style("margin-left",text_x+"px");
}

function delete_text(id){
  d3.select(".smart_text")
    .style("display","none");
}


init_reviews();

console.log("Created reviews");
