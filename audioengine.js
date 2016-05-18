// Start off by initializing a new context.
audio_context = new (window.AudioContext || window.webkitAudioContext)();

// Create a main gain node to set general volume
if (!audio_context.createGain){  
    audio_context.createGain = audio_context.createGainNode;
}
audio_context.gainNode = audio_context.createGain();
audio_context.gainNode.connect(audio_context.destination);

function setVolume(value){
  audio_context.gainNode.gain.value = value;
}


// Buffer loader class to load audiofiles from urls
function BufferLoader(url, callback, callback_error){
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        audio_context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    console.error('Error decoding file data: ' + url);
                    callback_error();
                } else {
                    loader.buffer = buffer;
                    if (callback){ callback(); }
                }
            },
            function(error) {
                console.error('DecodeAudioData error', error);
                callback_error();
            }
        );
    }
    request.onerror = function() {
        console.error('BufferLoader: XHR error');
    }
    request.send();
}
