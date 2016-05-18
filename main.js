/* Global variables and objects */

var use_fake_data = true;

// Sounds and content
var sounds = [];
var default_query = "instrument note"
var extra_descriptors = "lowlevel.mfcc.mean";
var map_similarity_feature = "lowlevel.mfcc.mean";
var n_pages = 1;
var n_pages_received = 0;
var all_loaded = false;

// t-sne
var max_tsne_iterations = 500;
var current_it_number = 0;
var epsilon = 10;
var perplexity = 10;
var tsne = undefined;
var runner;
var Y;

// Map
var w = window.innerWidth;
var h = window.innerHeight;
var tx=0; 
var ty=0;
var ss=1;
var min_zoom = 0.2;
var max_zoom = 15;
var map_scale_factor = 20;
var svg;

// Sounds display
var default_radius = 30;
var default_opacity = 0.7;
var default_stroke_width = 2;
var sound_selected_colour = "#ffffff";
var sound_playing_colour = "#ffffff";

// UI
var hover_playing_mode = false;


function start(){
    /* Prepare app to load data and display map */

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
            loadJSON(function(data) { loadDataFromFreesoundResponse(data); }, url);
        }    
    } else {
        query = "fake data";
        loadFakeData();
    }

    // Ui
    document.getElementById('query_terms_input').value = query;
    document.getElementById('info_placeholder').innerHTML = "Searching...";
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
}

function loadDataFromFreesoundResponse(data){
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

/* Event handlers */

function onKeyDown(evt) {
    if (evt.altKey) {
        hover_playing_mode = true;
    }
}

function onKeyUp(evt) {
    hover_playing_mode = false;
}

(function() {
  var formSubmitHandler = function formSubmitHandler(event) {
    event.preventDefault();
    start();
  }
  document.getElementById('query-form').onsubmit = formSubmitHandler;
})()
