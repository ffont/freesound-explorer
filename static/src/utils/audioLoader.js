import { REQUEST_POOL_SIZE } from '../constants';

const requestPool = (() => {
  const pool = [];
  for (let i = 0; i < REQUEST_POOL_SIZE; i++) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.available = true;
    pool.push(xhr);
  }
  return {
    getAvailableRequest() {
      for (let i = 0; i < REQUEST_POOL_SIZE; i++) {
        const xhr = pool[i];
        if (xhr.available) {
          return xhr;
        }
      }
      return undefined;
    },
  };
})();

/**
 * Initializes a single XMLHttpRequest object (avoiding memory leaks)
 * and exposes a closure to use it.
 */
const audioLoader = (audioContext) => ({
  loadSound(soundUrl) {
    return new Promise((resolve, reject) => {
      const xhr = requestPool.getAvailableRequest();
      xhr.open('GET', soundUrl);
      xhr.available = false;
      xhr.onreadystatechange = () => {
        xhr.available = true;
        if (xhr.status >= 200 && xhr.status < 300) {
          const buffer = xhr.response;
          if (buffer) {
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
      xhr.onerror = (error) => {
        xhr.available = true;
        reject(error);
      };
      xhr.send();
    });
  },
});

export default audioLoader;
