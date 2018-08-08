import makeActionCreator from 'utils/makeActionCreator';
import FileSaver from 'file-saver';
import { URLS } from '../../constants';
import { loadJSON, loadBLOB } from '../../utils/requests';
// import audioLoader from '../Audio/utils';

export const TOGGLE_SIDEBAR_VISIBILITY = 'TOGGLE_SIDEBAR_VISIBILITY';
export const SET_SIDEBAR_TAB = 'SET_SIDEBAR_TAB';
export const EXAMPLE_QUERY_DONE = 'EXAMPLE_QUERY_DONE';
export const MOVE_SIDEBAR_ARROW = 'MOVE_SIDEBAR_ARROW';

export const toggleSidebarVisibility = makeActionCreator(TOGGLE_SIDEBAR_VISIBILITY);
export const setSidebarTab = makeActionCreator(SET_SIDEBAR_TAB, 'newTab');
export const setExampleQueryDone = makeActionCreator(EXAMPLE_QUERY_DONE);
export const moveSidebarArrow = makeActionCreator(MOVE_SIDEBAR_ARROW, 'position');

export const batchDownloadSelectedOriginals = (selectedSounds, sounds) => {
  const fsIds = [];
  selectedSounds.forEach(soundID => fsIds.push(`${sounds[soundID].id.split('-')[0]}`));
  
  if (fsIds.length) {
    // dispatch(displaySystemMessage(`Download of ${selectedSounds.length} Sounds started, please wait.`));
    console.log(`Download of ${selectedSounds.length} Sounds started, please wait.`);
    loadBLOB(`${URLS.DOWNLOAD}?fsids=${fsIds}`).then(file => {
      const headers = file.headers;
      const mask = new RegExp('FreesoundExplorer.*');
      const filename = headers.match(mask)[0];
      FileSaver.saveAs(file.blob, filename);
      console.log('Download Finished');
    });
  } else {
    return;
  }
  // dispatch(displaySystemMessage('Download Finished'));
    // TODO:
    // Debug / abort when no files are selected
    // include licence in filemnames and text
};
