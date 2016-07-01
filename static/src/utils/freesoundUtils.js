import freesound from '../vendors/freesound';
import { selectSound } from './SoundFactory';
import uiUtils from './ui';

function getRequestParameter(name, queryUrl = location.search) {
  const parsedRegex = (new RegExp(
    `[?&]${encodeURIComponent(name)}=([^&]*)`)
  ).exec(queryUrl);
  return decodeURIComponent(parsedRegex[1]);
}

export function parseFreesoundSearchUrl(url) {
  const query = getRequestParameter('q', url);
  const filter = getRequestParameter('f', url);
  return { query, filter };
}

export function bookmarkSound(soundID) {
  freesound.setToken(sessionStorage.getItem('access_token'), 'oauth');
  const sound = selectSound(soundID);
  const successCallback = () => uiUtils.showMessage('Sound bookmarked!');
  const errorCallback = () => uiUtils.showMessage('Error bookmarking sound...');
  sound.fs_object.bookmark(
    sound.name,  // Use sound name
    'Freesound Explorer',  // Category
    successCallback,
    errorCallback
  );
}
