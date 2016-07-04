import { showWaveform } from './waveform';

const uiUtils = (() => {
  let waveformTimer = undefined;
  let messageTimer = undefined;
  return {
    showSoundInfo(sound) {
      clearTimeout(waveformTimer);
      const soundInfo =
        `${sound.name} by <a href="${sound.url}" target="_blank">${sound.username}</a>`;
      const htmlContent = `<div id="waveform"><div class="waveform-svg"></div></div>${soundInfo}`;
      // TODO: add bookmarking support (React?)
      document.getElementById('sound-info-box').innerHTML = htmlContent;
      // Should show waveform only if buffer has loaded
      // Temporary fix: setTimeout to give enough time for the buffer to load
      if (sound.buffer !== undefined) {
        showWaveform(sound);
      } else {
        waveformTimer = setTimeout(() => {
          showWaveform(sound);
        }, 1000);
      }
    },
    showMessage(msg, type = 'info', time = 2000) {
      clearTimeout(messageTimer);  // Clear timeout if there is one set
      let html = '';
      if (type === 'info') {
        html += '<i class="fa fa-info-circle" aria-hidden="true"></i>';
      }
      html += `&nbsp;&nbsp;${msg}`;
      document.getElementById('info-placeholder').innerHTML = html;
      document.getElementById('messages-box').style.display = 'block';  // Show message box

      if (time > 0) {  // Set timeout if indicated in time parameter
        messageTimer = setTimeout(() => {
          document.getElementById('messages-box').style.display = 'none';
        }, time);
      }
    },
  };
})();

export default uiUtils;
