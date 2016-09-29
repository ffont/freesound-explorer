import deepFreeze from 'deep-freeze';
import { default as reducer, initialState } from './reducer';
import { SET_SPACE_AS_CENTER } from '../Spaces/actions';
import { updateMapPosition, forceMapPositionUpdate } from './actions';
import { getMapCenter } from './utils';

describe('map reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('updateMapPosition', () => {
    const position = { translateX: 10, translateY: 20, scale: 3 };
    const stateBefore = initialState;
    const stateAfter = Object.assign({}, initialState, position);
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateMapPosition(position))).toEqual(stateAfter);
    });
  });
  describe('forceMapPositionUpdate', () => {
    const position = { translateX: 10, translateY: 20, scale: 3 };
    const stateBefore = initialState;
    const stateAfter = Object.assign({}, initialState, position, { forceMapUpdate: true });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, forceMapPositionUpdate(position))).toEqual(stateAfter);
    });
  });
  describe('setSpaceAsCenter', () => {
    const action = {
      type: SET_SPACE_AS_CENTER,
      spacePositionX: 400,
      spacePositionY: 200,
    };
    const mapCenter = getMapCenter();
    const stateBefore = { translateX: 10, translateY: 20, scale: 3 };
    const expectedState = {
      translateX: (mapCenter.x - action.spacePositionX) / stateBefore.scale,
      translateY: (mapCenter.y - action.spacePositionY) / stateBefore.scale,
      scale: 3,
      forceMapUpdate: true,
    };
    it('automatically moves to a new space', () => {
      expect(reducer(stateBefore, action)).toEqual(expectedState);
    });
  });
});
