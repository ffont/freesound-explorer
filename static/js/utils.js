/* Colours */

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    // usage: rgbToHex(0, 51, 255); // #0033ff
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* JSON requests */

function loadJSON(url, callback, error_callback) {   
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(xhr.response);
        } else {
            if (error_callback){
                error_callback();
            }
        }
    };
    xhr.onerror = function(){
        if (error_callback){
            error_callback();
        }
    }
    xhr.send();
}

/* Request parameters */

function getRequestParameter(name, string){
    if (string == undefined){
        string = location.search;
    }
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(string))
        return decodeURIComponent(name[1]);
}

/* Access nested object attributes by string */
// Example usage: Object.byString(someObj, 'part3[0].name');
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                    o = o[k];
            } else {
                    return;
            }
    }
    return o;
}


/* Data utilities */

function loadFakeData(data){
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

    M = 100;
    for (i=0; i<M; i++){
        var sound = new SoundFactory(
            id=i,
            preview_url='other/test_file.wav',
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
            username='Fake username ' + parseInt(i, 10),
            fs_object=undefined
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
