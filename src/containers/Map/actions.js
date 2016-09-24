import makeActionCreator from 'utils/makeActionCreator';

export const UPDATE_MAP_POSITION = 'UPDATE_MAP_POSITION';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');
