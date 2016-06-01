// Adapted from: http://bl.ocks.org/jm3/9870108

var max_points = 1024;
var width = 200,
height = 100;

function showWaveform(sound){
  // Prepare data
  var channel_data = sound.buffer.getChannelData(0);
  var channel_data_length = channel_data.length;
  var data = Array();
  for (var i=0; i<channel_data.length; i+=Math.ceil((channel_data.length/max_points))){
    data.push(channel_data[i]);
  }
  data = data.slice(1, max_points);

  // Render data
  svg_render( data, "#waveform > .waveform_svg" );
}

function svg_render( data, svg ) {
  var node = d3.select(svg).selectAll("*").remove(); // First remove all
  var node = d3.select(svg).append("svg")
    .attr("class","chart")
    .attr("width", width)
    .attr("height", height);

  var y = d3.scale.linear().range([height, -height]);
  var max_val = d3.max(data, function(d) { return d; });
  y.domain([-max_val, max_val]);
  var x = d3.scale.linear().domain([0, data.length]);
  var bar_width = width / data.length;

  var chart = node.attr("width", width).attr("height", height);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g") // svg "group"
    .attr("transform", function(d, i) {
      return "translate(" + i * bar_width + ",0)";
    });

  bar.append("rect")
    .attr("y", function(d) {
      var yv = height - Math.abs(y(d)/2) - height/2 + 2;
      return yv;
    })
    .attr("height", function(d) {
      return Math.abs(y(d)); })
    .attr("width", bar_width );
}
