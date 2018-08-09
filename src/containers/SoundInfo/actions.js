import makeActionCreator from 'utils/makeActionCreator';
import freesound from 'vendors/freesound';
import { MESSAGE_STATUS } from 'constants';
import { displaySystemMessage } from '../MessagesBox/actions';

export const OPEN_MODAL_FOR_SOUND = 'OPEN_MODAL_FOR_SOUND';
export const HIDE_MODAL = 'HIDE_MODAL';

export const hideModal = makeActionCreator(HIDE_MODAL);
export const openModalForSound = makeActionCreator(OPEN_MODAL_FOR_SOUND, 'sound');

export const bookmarkSound = sound => (dispatch) => {
  freesound.setToken(sessionStorage.getItem('accessToken'), 'oauth');
  sound.bookmark(
    sound.name,  // Use sound name
    'Freesound Explorer' // Category
  ).then(() => {
    dispatch(displaySystemMessage('Sound bookmarked!', MESSAGE_STATUS.SUCCESS));
  },
  () => dispatch(displaySystemMessage('Error bookmarking sound', MESSAGE_STATUS.ERROR)));
};
