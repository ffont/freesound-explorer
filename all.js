/* Global variables and objects */

var use_fake_data = true;

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
var hover_playing = false;

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
var default_radius = 30;
var default_opacity = 0.7;
var default_stroke_width = 2;
var min_zoom = 0.2;
var max_zoom = 15;


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
        .attr("id", function(d) { return 'point_' + parseInt(d.id, 10); })
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

function pulse(svg_object) {
    (function repeat() {
        svg_object = svg_object.transition()
            .duration(500)
            .attr("r", default_radius/1.5)
            .transition()
            .duration(500)
            .attr("r", default_radius/2)
            .ease('sine')
            .each("end", function(d){
                if (d.playing){
                    repeat();    
                }
            });
    })();
}

function unselect_all(){
    svg.selectAll('circle').each(function(d){d.unselect(d3.select(this));});
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
    document.onkeydown = keydown;
    document.onkeyup = keyup;
}

function keydown(evt) {
    if (evt.altKey) {
        hover_playing = true;
    }
}

function keyup(evt) {
    hover_playing = false;
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
    this.playing = false;
    this.buffer = undefined;
    this.is_buffer_loading = false;
    this.svg_object = undefined;

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

    var this_sound = this; // Useful for functions that use callbacks

    this.onmouseover = function(){
        this.svg_object.style("stroke", "#ffffff");
        if (hover_playing){
            this.play();
        }
    };

    this.onmouseout = function(){
        this.svg_object.style("stroke", this.rgba);
    };

    this.onclick = function(){
        var next_selected_value = !this.selected;
        if (this.playing){
            this.stop();
        }
        unselect_all();
        if (next_selected_value){
            this.play();
            this.select();
        }
    };

    this.select = function(){
        this.selected = true;
        showSoundInfo(this);
        this.updateDisplay();
    }

    this.unselect = function(){
        this.selected = false;
        this.updateDisplay();
    }

    this.play = function(){
        if (!this.playing){
            if (this.buffer == undefined){
                this.loadSound(play_once_loaded=true);
            } else {
                this.playing = true;
                // In web audio api, a new AudioBufferSourceNode is meant to be created
                // and connected to the audio graph every time we want to play a buffer
                this.source = audio_context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.connect(audio_context.gainNode);
                this.source.onended = function(){
                    this_sound.stop();
                }
                this.source.start(0);
            }  
        }
        this.updateDisplay();
    }

    this.stop = function(){
        if (this.playing){
            this.playing = false;
            this.source.stop(0);    
        }        
        this.svg_object.transition().duration(200).ease('sine').attr("r", default_radius/2);
        this.updateDisplay();
    }

    this.updateDisplay = function(){
        if (this.selected){
            this.svg_object.style("fill", "#ffffff");
            this.svg_object.style("fill-opacity", 1.0);
        } else {
            this.svg_object.style("fill", this.rgba);
            this.svg_object.style("fill-opacity", default_opacity);
        }

        if (this.playing){
            pulse(this.svg_object);
            this.svg_object.style("fill", "#ffffff");
            this.svg_object.style("fill-opacity", 1.0);
        } else {
            // Pulse will stop automatically
            this.svg_object.style("fill", this.rgba);
            this.svg_object.style("fill-opacity", default_opacity);
        }
    }

    this.loadSound = function(play_once_loaded){
        if (!this.is_buffer_loading){
            this.is_buffer_loading = true;
            buffer_loader = new BufferLoader(this.preview_url, 
                function() {  // callback ok
                    // Once loaded, assign buffer to sound object
                    this_sound.buffer = buffer_loader.buffer;
                    console.log('Loaded sound ' + this_sound.id + ': ' + this_sound.preview_url);
                    if (play_once_loaded){
                        this_sound.play();
                    }
                },
                function() {  // callback error
                    this.is_buffer_loading = false;
                }
            );
        }
    }
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
