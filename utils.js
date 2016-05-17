/* Audio stuff */

var AudioManager = function() {};

AudioManager.prototype.playSoundByName = function(name, time) {
    if (time == undefined){
        time = 0;
    }
    if (name in this){
        playSound(this[name], time, function(){
            stop_sound_by_name(name);
        });  
    } else {
        console.log("ERROR: sound " + name + " not available!")
    }
}

AudioManager.prototype.loadAndPlaySound = function(name, url) {
    var name = name.toString();
    var soundMap = {}
    soundMap[name] = url
    loadSounds(this, soundMap, function(){
        audio_manager.playSoundByName(name);
    });
}

/* Distance measures */

function computeEuclideanDistance(p1x, p1y, p2x, p2y){  
    return Math.sqrt( Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2) );
}

function computeEuclideanDistance3d(p1x, p1y, p1z, p2x, p2y, p2z){  
    return Math.sqrt( Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2) + Math.pow(p2z - p1z, 2) );
}

/* Colors */

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    // usage: rgbToHex(0, 51, 255); // #0033ff
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* JSON requests */

function loadJSON(callback, url) {   
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        n_pages_received += 1;
        if (status == 200) {
            callback(xhr.response);
        } else {
            console.log('Errort getting data from Freesound, status code: ' + xhr.status);
        }
    };
    xhr.send();
}

/* Request parameters */

function get_req_param(name){
     if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
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