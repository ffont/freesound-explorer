/**
 * Initializes a single XMLHttpRequest object (avoiding memory leaks)
 * and exposes a closure to use it.
 */
const audioEngine = (audioContext) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';
  return {
    loadSound(soundUrl) {
      return new Promise((resolve, reject) => {
        xhr.open('GET', soundUrl);
        xhr.onreadystatechange = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const buffer = xhr.response;
            if (!!buffer) {
              audioContext.decodeAudioData(buffer).then(
                decodedData => resolve(decodedData),
                error => reject(error)
              );
            }
          } else {
            reject('Error in the network');
          }
        };
        xhr.onerror = (error) => reject(error);
        xhr.send();
      });
    },
  };
};

export default audioEngine;
