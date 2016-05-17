/* Global variables and objects */

var use_fake_data = false;

// Audio stuff
var audio_manager = new AudioManager();

// Sounds and content
var default_query = "instrument note"
var sounds = [];
var Y;
var extra_descriptors = "lowlevel.mfcc.mean";
var map_similarity_feature = "lowlevel.mfcc.mean";
var n_pages = 1;
var n_pages_received = 0;
var all_loaded = false;
var last_selected_sound_id = undefined;

// t-sne
var max_tsne_iterations = 500;
var current_it_number = 0;
var epsilon = 10;
var perplexity = 10;
var tsne = undefined;
var runner;

// Map and display stuff
var svg;
var w = window.innerWidth;
var h = window.innerHeight;
var default_point_modulation = 0.6;
var disp_scale = Math.min(w, h);
var radius = 30;
//var min_zoom = 0.2;
//var max_zoom = 15;


/* d3 */

function updateMap() {
  var Y = tsne.getSolution();
  svg.selectAll('.u')
    .data(sounds)
    .attr("transform", function(d, i) { return "translate(" +
                                          (((Y[i][0]+(w/(20*2)))*20*ss + tx)) + "," +
                                          (((Y[i][1]+(h/(20*2)))*20*ss + ty)) + ")"; });
}

function drawMap() {

    var div = d3.select("#map");
    svg = div.append("svg") // svg is global
        .attr("width", "100%")
        .attr("height", "100%");

    var g = svg.selectAll(".b")
        .data(sounds)
        .enter().append("g")
        .attr("class", "u");

    g.append("svg:circle")
        .attr("cx", -radius)  // make sure points appear outside div before first iteration
        .attr("cy", -radius)  // make sure points appear outside div before first iteration
        .attr("r", radius/2)
        //.style("mix-blend-mode", "lighten")
        .style("fill", function(d) { return d.rgba; })
        .attr("fill-opacity", .65)
        .attr("stroke", function(d) { return d.rgba; })
        .attr("stroke-width", 1) 
        .attr("stroke-opacity", .9)
        .on("mouseover", function(d) {
            d.onmouseover(d3.select(this));
        })
        .on("mouseout", function(d) {
            d.onmouseout(d3.select(this));
        })
        .each(pulse);

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", zoomHandler);
    zoom(div);
}

function pulse() {
    var circle = svg.selectAll("circle");
    (function repeat() {
        circle = circle.transition()
            .duration(1000)
            .attr("r", radius/2.2)
            .transition()
            .duration(1000)
            .attr("r", radius/2)
            .ease('sine')
            .each("end", repeat);
    })();
}

var tx=0, ty=0;
var ss=1;
function zoomHandler() {
  tx = d3.event.translate[0];
  ty = d3.event.translate[1];
  ss = d3.event.scale;
  updateMap();
}

function step() {
    current_it_number += 1;  
    if (current_it_number <= max_tsne_iterations){
        document.getElementById('info_placeholder').innerHTML = 'Computing map...';
        tsne.step();
    } else {
        clearInterval(runner);
        document.getElementById('info_placeholder').innerHTML = "Done, " + sounds.length + " sounds loaded!";
    }
    updateMap();
}


/* Setup and app flow functions */

function start(){

    // Sounds
    sounds = [];
    n_pages_received = 0;
    all_loaded = false;

    // Map
    var map = document.getElementById("map");
    map.innerHTML = null; 
    w = window.innerWidth;
    h = window.innerHeight;

    // t-sne
    current_it_number = 0;
    var opt = {}
    opt.epsilon = epsilon; // epsilon is learning rate (10 = default)
    opt.perplexity = perplexity; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 2; // dimensionality of the embedding (2 = default)
    tsne = new tsnejs.tSNE(opt); // create a tSNE instance

    if (!use_fake_data){
        // Search sounds and start loading them
        var query = document.getElementById('query_terms_input').value;
        if ((query == undefined) || (query=="")){
            query = default_query;
        }
        for (var i=0; i<n_pages; i++){
            var url = "https://freesound.org/apiv2/search/text/?query=" + query + "&" +
            "group_by_pack=0&filter=duration:[0+TO+2]&fields=id,previews,name,analysis,url,username" +
            "&descriptors=sfx.tristimulus.mean," + extra_descriptors + "&page_size=150" +
            "&token=eecfe4981d7f41d2811b4b03a894643d5e33f812&page=" + (i + 1);
            loadJSON(function(data) { load_data_from_fs_json(data); }, url);
        }    
    } else {
        load_fake_data();
    }

    // Ui
    document.getElementById('query_terms_input').value = query;
    document.getElementById('info_placeholder').innerHTML = "Searching...";
}

/* Sounds stuff */

function SoundFactory(id, preview_url, analysis, url, name, username){
    this.x =  0.0;
    this.y =  0.0;
    this.rad = 10;
    this.mod_position = Math.random();
    this.mod_inc = 0.1;
    this.mod_amp = default_point_modulation;
    this.selected = false;

    this.id = id;
    this.preview_url = preview_url;
    this.analysis = analysis;

    this.rgba = rgbToHex(
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][0]),
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][1]),
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][2])
    )

    this.url = url;
    this.name = name;
    this.username = username;

    this.onmouseover = function(svg_object){
        svg_object.style("stroke", function(d) { return "#ffffff"; });
    };

    this.onmouseout = function(svg_object){
        svg_object.style("stroke", function(d) { return this.rgba; });
    };
}

function load_fake_data(data){
    M = 100;
    for (i=0; i<M; i++){
        var sound = new SoundFactory(
            id=i,
            preview_url=undefined,
            analysis={
                'fake_feature': [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
                'sfx': {
                    'tristimulus': {
                        'mean': [Math.random(), Math.random(), Math.random()]
                    },
                },
            },
            url='http://example.com/' + parseInt(i, 10),
            name='Fake sound ' + parseInt(i, 10),
            username='Fake username ' + parseInt(i, 10)
        );
        sounds.push(sound);
    }
    // Init t-sne with sounds features
    var X = [];
    for (i in sounds){
        sound_i = sounds[i];
        var feature_vector = Object.byString(sound_i, 'analysis.fake_feature');
        X.push(feature_vector);
    }
    tsne.initDataRaw(X);
    all_loaded = true;
    console.log('Loaded tsne with ' + sounds.length + ' sounds')
    drawMap();
    runner = setInterval(step, 1000/60);
}


function load_data_from_fs_json(data){
    for (i in data['results']){
        var sound_json = data['results'][i];
        if (sound_json['analysis'] != undefined){
            var sound = new SoundFactory(
                id=sound_json['id'],
                preview_url=sound_json['previews']['preview-lq-mp3'],
                analysis=sound_json['analysis'],
                url=sound_json['url'],
                name=sound_json['name'],
                username=sound_json['username']
            );
            sounds.push(sound);
        }
    }
    if (n_pages_received == n_pages){
        // Init t-sne with sounds features
        var X = [];
        for (i in sounds){
            sound_i = sounds[i];
            var feature_vector = Object.byString(sound_i, 'analysis.' + map_similarity_feature);
            X.push(feature_vector);
        }
        tsne.initDataRaw(X);
        all_loaded = true;
        console.log('Loaded tsne with ' + sounds.length + ' sounds')
        drawMap();
        runner = setInterval(step, 0);
    }
}

function checkSelectSound(x, y){
    var min_dist = 9999;
    var selected_sound = false;
    for(i in sounds){
        var sound = sounds[i];
        var dist = computeEuclideanDistance(sound.x, sound.y, x, y);
        if (dist < min_dist){
            min_dist = dist;
            selected_sound = sound;
        }
    }

    if (min_dist < 0.01){
        if (!selected_sound.selected){
            selectSound(selected_sound);
        }
    }
}

function selectSound(selected_sound){
    if (!selected_sound.selected){
        if (selected_sound.preview_url != undefined){
            selected_sound.selected = true;    
            selected_sound.mod_amp = 5.0;
            audio_manager.loadSound(selected_sound.id, selected_sound.preview_url);    
        }
        showSoundInfo(selected_sound);
        last_selected_sound_id = selected_sound['id']
    } else {
        if (selected_sound.preview_url != undefined){
            selected_sound.selected = false;
            selected_sound.mod_amp = default_point_modulation;
        }
    }
}

function selectSoundFromId(sound_id){
    for (i in sounds){
        var sound = sounds[i];
        if (sound.id == parseInt(sound_id)){
            selectSound(sound);
        }
    }
}

function showSoundInfo(sound){
    var html = '';
    html += sound.name + ' by <a href="' + sound.url + '" target="_blank">' + sound.username + '</a>';
    document.getElementById('sound_info_box').innerHTML = html;
}

function setMapDescriptor(){
    var selected_descriptor = document.getElementById('map_descriptors_selector').value;
    extra_descriptors = selected_descriptor;
    map_similarity_feature = selected_descriptor;
}


// form submit event handler
(function() {
  var formSubmitHandler = function formSubmitHandler(event) {
    event.preventDefault();
    start();
  }
  document.getElementById('query-form').onsubmit = formSubmitHandler;
})()
