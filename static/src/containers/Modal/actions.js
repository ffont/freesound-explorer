import makeActionCreator from './makeActionCreator';

export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const SET_MODAL_PAGE = 'SET_MODAL_PAGE';

export const toggleModal = makeActionCreator(TOGGLE_MODAL);
export const setModalPage = makeActionCreator(SET_MODAL_PAGE, 'newPage');
