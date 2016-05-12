/* Global variables and objects */

var use_fake_data = true;

// Audio stuff
var audio_manager = new AudioManager();

// Sounds and content
var default_query = "instrument note"
var sounds = [];
var extra_descriptors = "lowlevel.mfcc.mean";
var map_similarity_feature = "lowlevel.mfcc.mean";
var n_pages = 3;
var n_pages_received = 0;
var all_loaded = false;
var last_selected_sound_id = undefined;

// t-sne
var max_tsne_iterations = 500;
var current_it_number = 0;
var epsilon = 10;
var perplexity = 10;
var tsne = undefined;

// Canvas and display stuff
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = window.innerWidth;
var h = window.innerHeight;
var default_point_modulation = 0.6;
var disp_scale = Math.min(w, h);
var center_x = undefined;  // Set in start()
var center_y = undefined;  // Set in start()
var zoom_factor = undefined;  // Set in start()
var rotation_degrees = undefined;  // Set in start()
var min_zoom = 0.2;
var max_zoom = 15;

/* Setup and app flow functions */

function start(){

    // Sounds
    sounds = [];
    n_pages_received = 0;
    all_loaded = false;

    // Canvas
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseOut, false);
    center_x = 0.5;
    center_y = 0.5;
    zoom_factor = 1.5;
    rotation_degrees = 0;

    // Display stuff
    if (w >= h){
        disp_x_offset = (w - h) / 2;
        disp_y_offset = 0.0;
    } else {
        disp_x_offset = 0.0;
        disp_y_offset = (h - w) / 2;
    }

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

window.requestAnimFrame = (function(){ // This is called when code reaches this point
    return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
})();

(function init(){ // This is called when code reaches this point
    //start();
})();

(function loop(){  // This is called when code reaches this point
    if ((all_loaded == true) && (current_it_number <= max_tsne_iterations)){
        document.getElementById('info_placeholder').innerHTML = 'Computing map...';

        tsne.step();
        Y = tsne.getSolution();
        var xx = [];
        var yy = [];
        for (i in Y){
            xx.push(Y[i][0]);
            yy.push(Y[i][1]);
        }
        min_xx = Math.min(...xx);
        max_xx = Math.max(...xx);
        min_yy = Math.min(...yy);
        max_yy = Math.max(...yy);
        var delta_xx = max_xx - min_xx;
        var delta_yy = max_yy - min_yy;
        for (i in sounds){
            var sound = sounds[i];
            var x = Y[i][0];
            var y = Y[i][1];
            sound.x = -min_xx/delta_xx + x/delta_xx;
            sound.y = -min_yy/delta_yy + y/delta_yy;
            if (delta_xx > delta_yy){
                sound.y = sound.y * (delta_yy/delta_xx); // Preserve tsne aspect ratio
            } else {
                sound.x = sound.x * (delta_xx/delta_yy); // Preserve tsne aspect ratio
            }


            sound.x = sound.x * Math.pow(100, current_it_number/max_tsne_iterations - 1) + 0.5 * (1 - Math.pow(100, current_it_number/max_tsne_iterations - 1)); // Smooth position at the beginning
            sound.y = sound.y * Math.pow(100, current_it_number/max_tsne_iterations - 1) + 0.5 * (1 - Math.pow(100, current_it_number/max_tsne_iterations - 1)); // Smooth position at the beginning
        }
    }
    if (current_it_number == max_tsne_iterations) {
        document.getElementById('info_placeholder').innerHTML = "Done, " + sounds.length + " sounds loaded!";
    }
    current_it_number += 1;
    draw();
    requestAnimFrame(loop);
})();


/* Sounds stuff */

function SoundFactory(id, preview_url, analysis, url, name, username){
    this.x =  0.5; //Math.random();
    this.y =  0.5; //Math.random();
    this.rad = 10;
    this.mod_position = Math.random();
    this.mod_inc = 0.1;
    this.mod_amp = default_point_modulation;
    this.selected = false;

    this.id = id;
    this.preview_url = preview_url;
    this.analysis = analysis;

    var color = rgbToHex(
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][0]),
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][1]),
        Math.floor(255 * analysis['sfx']['tristimulus']['mean'][2])
    )
    this.rgba = color;

    this.url = url;
    this.name = name;
    this.username = username;
}

function load_fake_data(data){
    M = 100;
    for (i=0; i<M; i++){
        var sound = new SoundFactory(
            id=i,
            preview_url='http://example.com/preview/' + parseInt(i, 10),
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
        selected_sound.selected = true;
        selected_sound.mod_amp = 5.0;
        audio_manager.loadSound(selected_sound.id, selected_sound.preview_url);
        showSoundInfo(selected_sound);
        last_selected_sound_id = selected_sound['id']
    } else {
        selected_sound.selected = false;
        selected_sound.mod_amp = default_point_modulation;
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

/* Drawing */

function draw(){
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for(i in sounds){
        var sound = sounds[i];
        var disp_x, disp_y;
        [disp_x, disp_y] = normCoordsToDisplayCoords(sound.x, sound.y)

        if (!sound.selected){
            ctx.fillStyle = sound.rgba;
            ctx.strokeStyle = sound.rgba;
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#ffffff';
        }

        if (last_selected_sound_id == sound['id']){
            ctx.fillStyle = '#ffffff';
        }

        ctx.beginPath();
        ctx.arc(disp_x, disp_y, sound.rad*zoom_factor*Math.pow(0.9,zoom_factor), 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(disp_x, disp_y, (sound.rad+5+(sound.mod_amp*Math.cos(sound.mod_position)))*zoom_factor*Math.pow(0.9,zoom_factor), 0, Math.PI*2, true);
        ctx.stroke();
        ctx.closePath();

        sound.mod_position += sound.mod_inc;
    }
}

// form submit event handler
(function() {
  var formSubmitHandler = function formSubmitHandler(event) {
    event.preventDefault();
    start();
  }
  document.getElementById('query-form').onsubmit = formSubmitHandler;
})()
