/* Global variables and objects */

// Sounds and content
var sounds = [];
var default_query = "instrument note"
var default_filter = "duration:[0%20TO%202]"
var extra_descriptors = "lowlevel.mfcc.mean";
var map_similarity_feature = "lowlevel.mfcc.mean";
var n_pages = 2;
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
document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;


function search(query, filter){
    if ((query == undefined) || (query=="")){ query = default_query; document.getElementById('query_terms_input').value = default_query; }
    if ((filter == undefined) || (filter=="")){ filter = default_filter; }


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

    
    // Search sounds and start loading them
    freesound.setToken(sessionStorage.getItem("app_token"));
    for (var i=0; i<n_pages; i++){
        freesound.textSearch(query, {
            page:(i + 1), page_size:150, group_by_pack:0,
            filter:filter, 
            fields:"id,previews,name,analysis,url,username", 
            descriptors:"sfx.tristimulus.mean," + extra_descriptors 
            }, function(response){
                for (i in response.results){
                    var sound = response.results[i];
                    if (sound.analysis != null){
                        var sound = new SoundFactory(
                            id=sound.id,
                            preview_url=sound.previews["preview-lq-mp3"],
                            analysis=sound.analysis,
                            url=sound.url,
                            name=sound.name,
                            username=sound.username
                        );
                        sounds.push(sound);
                    }
                }
                post_receive_search_results();
            },function(){ 
                post_receive_search_results();
                console.log("Error while searching..."); 
            }
        );
    }    
    
    // Ui
    document.getElementById('info_placeholder').innerHTML = "Searching...";
}

function post_receive_search_results(){
    n_pages_received += 1;
    // Check if all information has already been received and if that is the case start the map
    if (n_pages_received == n_pages){
        if (sounds.length > 0){
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
        } else {
            // No results found
            console.log('No results found...')
            document.getElementById('info_placeholder').innerHTML = 'No results found...';

        }
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

function submitQuery(){
    var query = document.getElementById('query_terms_input').value;
    if ((query.startsWith("http")) && (query.indexOf("freesound.org") != -1)){
        // Freesound url, parse query and filter and search

        var q_f = parseFreesoundSearchUrl(query)
        console.log(query)
        console.log(q_f)
        search(q_f[0], q_f[1]);
    } else {
        // normal query
        search(query);
    }
}

(function() {
  var formSubmitHandler = function formSubmitHandler(event) {
    event.preventDefault();
    submitQuery();
  }
  document.getElementById('query-form').onsubmit = formSubmitHandler;
})()
