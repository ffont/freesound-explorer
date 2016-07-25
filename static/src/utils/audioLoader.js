/**
 * Initializes a single XMLHttpRequest object (avoiding memory leaks)
 * and exposes a closure to use it.
 */
const audioLoader = (audioContext) => {
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
              try {
                // support for decodeAudioData with promise
                audioContext.decodeAudioData(buffer).then(
                  decodedData => resolve(decodedData),
                  error => reject(error)
                );
              } catch (e) {
                // old syntax with callback
                audioContext.decodeAudioData(buffer,
                  (decodedData) => resolve(decodedData)
                );
              }
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

export default audioLoader;
