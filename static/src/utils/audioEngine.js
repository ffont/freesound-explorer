// Start off by initializing a new context.
export const audioContext = (() => {
  const context = new (window.AudioContext || window.webkitAudioContext)();

  // Create a main gain node to set general volume
  if (!context.createGain) {
    context.createGain = context.createGainNode;
  }
  context.gainNode = context.createGain();
  context.gainNode.connect(context.destination);
  return context;
})();

export function setVolume(value) {
  audioContext.gainNode.gain.value = value;
}

// Buffer loader class to load audiofiles from urls
export function BufferLoader(url, callback, errorCallback) {
  // Load buffer asynchronously
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = () => {
    // Asynchronously decode the audio file data in request.response
    audioContext.decodeAudioData(
      request.response,
      (buffer) => {
        if (!buffer) {
          console.error(`Error decoding file data: ${url}`);
          errorCallback();
        } else {
          this.buffer = buffer;
          if (callback) { callback(); }
        }
      },
      (error) => {
        console.error('DecodeAudioData error', error);
        errorCallback();
      }
    );
  };
  request.onerror = () => {
    console.error('BufferLoader: XHR error');
  };
  request.send();
}
