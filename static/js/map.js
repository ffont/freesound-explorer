function drawMap() {
    /* This function is called once sounds's data is received and loaded */
    var div = d3.select("#map");
    svg = div.append("svg") // svg is global
        .attr("width", "100%")
        .attr("height", "100%");

    var g = svg.selectAll(".b")
        .data(sounds)
        .enter().append("g")
        .attr("class", "u");

    g.append("svg:circle")
        .attr("id", function(d) { return 'point_' + parseInt(d.id, 10); })
        .attr("class", "sound_point")
        .attr("cx", -default_radius)  // make sure points appear outside div before first iteration
        .attr("cy", -default_radius)  // make sure points appear outside div before first iteration
        .attr("r", default_radius/2)
        //.style("mix-blend-mode", "lighten")
        .style("fill", function(d) { return d.rgba; })
        .style("fill-opacity", default_opacity)
        .style("stroke", function(d) { return d.rgba; })
        .style("stroke-width", default_stroke_width) 
        .style("stroke-opacity", .9)
        .on("mouseover", function(d) {
            d.onmouseover();
        })
        .on("mouseout", function(d) {
            d.onmouseout();
        })
        .on("click", function(d) {
            d.onclick();
        })
        .each(function(d) {
            d.svg_object = d3.select(this); // Add reference to sound object
        })
        ;

    var zoom = d3.behavior.zoom()
        .scaleExtent([min_zoom, max_zoom])
        .on("zoom", zoomHandler);
    zoom(div);
    div.on("dblclick.zoom", null); // disable double click zoom
}

function updateMap() {
    /* This function is called every time sound positions are updated */
    var Y = tsne.getSolution();
    svg.selectAll('.u')
    .data(sounds)
    .attr("transform", function(d, i) { 
        return "translate(" +
        (((Y[i][0]+(w/(map_scale_factor*2)))*map_scale_factor*ss + tx)) + "," +
        (((Y[i][1]+(h/(map_scale_factor*2)))*map_scale_factor*ss + ty)) + ")";
    });
}

function zoomHandler() {
    /* This function is when zooming and panning */
    tx = d3.event.translate[0];
    ty = d3.event.translate[1];
    ss = d3.event.scale;
    updateMap();
}

function step() {
    /* This function is called at each iteration of map computation */
    current_it_number += 1;  
    if (current_it_number <= max_tsne_iterations){
        showMessage('Computing map...');
        tsne.step();
    } else {
        clearInterval(runner);
        showMessage("Done, " + sounds.length + " sounds loaded!");
    }
    updateMap();
}

function selectPoint(point_id){
    return svg.select('#point_' + parseInt(point_id, 10))[0][0];
}
