// ---------------------------- //
// --- AMAZON SMART REVIEWS --- //
// ---------------------------- //
// ----- Authors: ------------- //
// ----- Hagen Hiller --------- //
// ----- Ephraim Schott ------- //
// ---------------------------- //

// global variables 
var padding = 50

var w = document.getElementById("smart_visu").parentNode.offsetWidth;
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


function init_extension() {
  // get number of reviews to init the review-bar
  _review_count = document.getElementById("acrCustomerReviewText").innerText;
  _review_count = parseInt(_review_count.replace(/\D/g,''));
  console.log("Reviews: ", _review_count);
  
  // create empty review objects that can be filled later
  if (_review_count == 0) {
    review_data.push({id: 0});
  } 
  else {
    // init all rects with same width
    _current_width = 0;
    for (var i = 0; i < _review_count; i++){
      mapped_width = parseFloat(map_rect_to_screen_by(_review_count,1)) - 1; // -1 becos of stroke
      review_data.push({id: i});
      rect_data.push({id: i, 
                      width: mapped_width,  
                      x: _current_width });
      _current_width += mapped_width;
    }
  }
  draw_review_bar(rect_data, visu_container);

  // get id of product
  _url = document.URL;
  _url = _url.split("/");
  _product_id = _url[5];

  get_reviews(_product_id);
}


function draw_review_bar(data, visu_svg) {
  var rects = visu_svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect");

    rects.attr("id", function(d,i) { return "r" + i; })
      .attr("x", function(d,i) { return rect_data[i].x })
      .attr("y", 0)
      .attr("width", function(d,i) { return rect_data[i].width })
      .attr("height", h)
      .attr("stroke", "white")
      .attr("fill", "lightgray");

    draw_loading_sign();
}


function get_reviews(product_id){
  _crawl_reviews_url = "http://amazon.smart-comments.com/id/" + product_id;

  // Create the XHR object to do GET to the data  
  var xhr = new XMLHttpRequest();
  xhr.open("GET", _crawl_reviews_url, true);

  // register the event handler
  xhr.addEventListener('load',function(){
    if(xhr.status === 200){
      _raw_reviews = xhr.response;
      delete_loading_sign();
      process_reviews(_raw_reviews);
    }
  },false) 
  xhr.send( null );
}

function draw_loading_sign(visu_svg) {
  console.log("loading");
}

function delete_loading_sign(visu_svg){
  console.log("loaded");
}

function process_reviews(raw_reviews){
  var dsv = d3.dsv("|", "text/plain");
  review_data = dsv.parse(raw_reviews)
  //'id','upvotes','total_votes','stars','author','date','text'

  review_data.forEach(function(d,i) {
    d.total_votes = parseInt(d.total_votes);
    d.upvotes  = parseInt(d.upvotes);
    d["downvotes"] = (d.total_votes - d.upvotes);
    d["review_rating"] = (d.upvotes - d.downvotes);
    d["stars"] = d.stars;
    d["author"] = d.author;
    d["text"] = d.text;
    d["id"] = i;
    d["aid"] = d.id;
  });

  min_vote_sum = d3.min(review_data,function(d) {
    return parseFloat(d.review_rating)
  });

  max_vote_sum = d3.max(review_data,function(d) {
    return parseFloat(d.review_rating)
  });
  
  review_data.forEach(function(d) {             // calc width of all rects
    width_sum += parseFloat(rate_votings(1, 10, d.review_rating));
  });

  var current_width = 0;
  review_data.forEach(function(d,i) {
    mapped_width = parseFloat(map_rect_to_screen_by(width_sum,
                   parseFloat(rate_votings(1, 10,d.review_rating)))) -1;
    rect_data[i].width = mapped_width; // -1 because of the stroke width
    rect_data[i].x = current_width;
    rect_data[i]["review_rating"] = d.review_rating;
    rect_data[i]["stars"] = d.stars
    current_width += mapped_width;
  });

  update_review_bar(rect_data, visu_container);
}

function update_review_bar(data, visu_svg){
  var rects = visu_svg.selectAll("rect");

  rects.attr("id", function(d,i) { return "r" + i; })
    .on("mouseover",  function(d,i) {
        visu_svg.select("#r"+parseInt(d.id))
          .transition()
          .duration(100)
          .attr("fill", "#44AADD");
        draw_pointer(data[d.id],visu_svg);
        draw_text(data[d.id]);
    })
    .on("mouseout",function (d,i) {
      visu_svg.select("#r"+parseInt(d.id))
        .transition()
        .duration(100)
        .attr("fill", "lightgray")
        .attr("fill", color_scale(d.review_rating));
      delete_pointer(visu_svg);
      delete_text(d.id);
    })
    .transition()
    .duration(750)
      .attr("x", function(d,i) { return data[i].x })
      .attr("width", function(d,i) { return data[i].width })
      .attr("fill", function(d,i) {return color_scale(d.review_rating)});
}

function draw_pointer(rect, visu_svg){
  var rect_pos = rect.x + (rect.width / 2);
  visu_svg.select("#pointer")
      .style("display", "initial")
      .transition()
      .duration(100)
      .style("fill", "#66CCFF")
      .style("stroke", "#66CCFF")
      .attr("points",rect_pos+","+h+","+(rect_pos-10)+","+(h+10)+","+(rect_pos+10)+","+(h+10) );
}

function delete_pointer(visu_svg){
  visu_svg.select("#pointer")
      .style("display", "none")
}


function draw_text(rect){
  var text_width = 400;
  var text_height = 300;
  var text_x = 0;
  d3.select(".smart_text")
    .style("display","block")
    .style("width",text_width+"px")
    .style("height",text_height+"px")
    .style("background-color", "#66CCFF")
    .style("overflow-y","auto")
    .text("ID: "+review_data[rect.id].id + " - " +
          review_data[rect.id].text);

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

function map_rect_to_screen_by( value_domain, value){
  var screen_scale = d3.scale.linear() // scales rects into screen size
    .domain([0, value_domain])
    .range([1,w]);
  return screen_scale(value)
}

function map_color_between(min_val, max_val, col_a, col_b, value){
  var col_scl = d3.scale.linear()
    .domain([min_val,max_val])
    .range([col_a,col_b]);
  return col_scl(value);
}

function color_scale(value){
  var col_scl = d3.scale.linear()
    .domain([min_vote_sum,max_vote_sum])
    .range(["lightgray","green"]);
  return col_scl(value);
}


function rate_votings(min_rating, max_rating, value){
  // rate reviews depending on max and min vote_sum of all
  var vote_sum_scale = d3.scale.linear()  
    .domain([min_vote_sum,max_vote_sum])
    .range([min_rating, max_rating]);
  return vote_sum_scale(value);
}

init_extension();

