import { UPDATE_MAP_POSITION } from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');
