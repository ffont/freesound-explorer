import { TOGGLE_MODAL, SET_MODAL_PAGE } from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const toggleModal = makeActionCreator(TOGGLE_MODAL);
export const setModalPage = makeActionCreator(SET_MODAL_PAGE, 'newPage');
