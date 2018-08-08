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
  // downloadUrls.forEach(element => {
  loadBLOB(`${URLS.DOWNLOAD}?fsids=${fsIds}`).then(file => {
    console.log('file: ', file);

    const headers = file.headers;
    console.log('headers: ', headers);
    const mask = new RegExp('FreesoundExplorer.*');
    const filename = headers.match(mask)[0];
    FileSaver.saveAs(file.blob, filename);
  });
    // audioLoader.loadFile(element).then(r => console.log(r));
    // TODO:
    // make a list of fs ids and pass it to the backend
    // download and zip files
    // include licence in filemnames and text
    // pass it back to the frontend to download
  // }
// );
  
}