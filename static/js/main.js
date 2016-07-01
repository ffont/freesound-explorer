/* Global variables and objects */

// Supports end user auth
var supports_end_user_auth = true;  // Will be set to true if there is backend for auth

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


/* Event handlers */

function onKeyDown(evt) {
    if (evt.altKey) {
        hover_playing_mode = true;
    }
}

function onKeyUp(evt) {
    hover_playing_mode = false;
}
