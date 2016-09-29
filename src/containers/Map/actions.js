import makeActionCreator from 'utils/makeActionCreator';

export const UPDATE_MAP_POSITION = 'UPDATE_MAP_POSITION';
export const FORCE_MAP_POSITION_UPDATE = 'FORCE_MAP_POSITION_UPDATE';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');
export const forceMapPositionUpdate = makeActionCreator(FORCE_MAP_POSITION_UPDATE, 'position');
