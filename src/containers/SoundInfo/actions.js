import makeActionCreator from 'utils/makeActionCreator';
import { saveAs } from 'file-saver';
import freesound from 'vendors/freesound';
import { MESSAGE_STATUS } from 'constants';
import { displaySystemMessage } from '../MessagesBox/actions';
import { loadBLOB } from '../../utils/requests';


export const OPEN_MODAL_FOR_SOUND = 'OPEN_MODAL_FOR_SOUND';
export const HIDE_MODAL = 'HIDE_MODAL';

export const hideModal = makeActionCreator(HIDE_MODAL);

export const openModalForSound = makeActionCreator(OPEN_MODAL_FOR_SOUND, 'sound');

const makeRequest = (uri, method) => {
  return new Promise((resolve, failure) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && [200,201,202].indexOf(xhr.status)>=0) {
        const data = `${xhr.responseText})`;
        resolve(data);
      }
      else if (xhr.readyState === 4 && xhr.status !== 200) {
          failure(xhr.statusText);
        }
    };
    xhr.open(method, uri, true);
    // xhr.withCredentials = true;
    // xhr.setRequestHeader('Authorization', 'Token eecfe4981d7f41d2811b4b03a894643d5e33f812');// freesound.authHeader);
    xhr.setRequestHeader('Content-Type', 'blob');
    xhr.send();
  })

};

export const bookmarkSound = sound => (dispatch) => {
  freesound.setToken(sessionStorage.getItem('accessToken'), 'oauth');
  debugger
  sound(
    sound.name,  // Use sound name
    'Freesound Explorer' // Category
  ).then(() => {
    dispatch(displaySystemMessage('Sound bookmarked!', MESSAGE_STATUS.SUCCESS));
  },
  () => dispatch(displaySystemMessage('Error bookmarking sound', MESSAGE_STATUS.ERROR)));
};

export const downloadSound = (sound) => (dispatch) => {
  freesound.setToken(sessionStorage.getItem('accessToken'), 'oauth');
  debugger
  const { downloadUrl } = sound;
  dispatch(displaySystemMessage('Downloading sound...',
  MESSAGE_STATUS.INFO));
  // const uri = sound(sound.downloadUrl);
  makeRequest(downloadUrl, 'GET').then(audio => console.log(audio));
  dispatch(displaySystemMessage('Download completed...',
  MESSAGE_STATUS.INFO));

};
