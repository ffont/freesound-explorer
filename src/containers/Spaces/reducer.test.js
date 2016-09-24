import { spaceInitialState, singleSpace, spacesReducer, currentSpace }
  from './reducer';
import { REMOVE_SOUND, FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_SUCCESS, FETCH_SOUNDS_FAILURE }
  from '../Sounds/actions';
import { updateMapPosition } from '../Map/actions';
import { REMOVE_SPACE } from './actions';
import { computeSpacePosition, computeSpacePositionInMap, getClosestSpaceToCenter }
  from './utils';

const queryID = 'query0';
const queryParams = { maxDuration: 4 };
const query = 'test query';
const spaceIndex = 0;
const spacePosition = computeSpacePosition(spaceIndex);
const space0 = Object.assign({}, spaceInitialState, {
  position: spacePosition,
  queryID,
  query,
  queryParams,
  spaceIndex,
});

const sounds = ['sound0', 'sound1'];
const mapPosition = { translateX: 0, translateY: 0, scale: 1 };
const currentPositionInMap = computeSpacePositionInMap(space0.position, mapPosition);
const space0WithSounds = Object.assign({}, space0, { sounds, currentPositionInMap });

describe('singleSpace', () => {
  it('correctly stores new space at creation', () => {
    const action = { type: FETCH_SOUNDS_REQUEST, query, queryID, queryParams };
    expect(singleSpace(undefined, action, spaceIndex)).toEqual(space0);
  });
  it('correctly adds sounds when received', () => {
    const receivedSounds = { sound0: {}, sound1: {} };
    const action = { type: FETCH_SOUNDS_SUCCESS, sounds: receivedSounds, queryID, mapPosition };
    expect(singleSpace(space0, action)).toEqual(space0WithSounds);
    expect(currentSpace(undefined, action)).toEqual(space0.queryID);
  });
  it('updates current position when moving map', () => {
    const mapPos = { translateX: 200, translateY: 400, scale: 4 };
    const currentPos = computeSpacePositionInMap(space0.position, mapPos);
    const action = updateMapPosition(mapPos);
    expect(singleSpace(space0, action).currentPositionInMap).toEqual(currentPos);
  });
  it('correctly removes a sound from a space', () => {
    const action = { type: REMOVE_SOUND, soundID: 'sound0', queryID };
    const expectedState = Object.assign({}, space0WithSounds, { sounds: ['sound1'] });
    expect(singleSpace(space0WithSounds, action)).toEqual(expectedState);
  });
});

describe('spacesReducer', () => {
  it('correctly removes spaces', () => {
    const stateBefore = [space0];
    const action = { type: REMOVE_SPACE, queryID: space0.queryID };
    expect(spacesReducer(stateBefore, action)).toEqual([]);
  });
  it('correctly removes spaces when query fails', () => {
    const stateBefore = [space0];
    const action = { type: FETCH_SOUNDS_FAILURE, queryID: space0.queryID };
    expect(spacesReducer(stateBefore, action)).toEqual([]);
  });
});

describe('currentSpace', () => {
  it('correctly selects closest space when moving map', () => {
    const mapPos = { translateX: 200, translateY: 400, scale: 4 };
    const action = updateMapPosition(mapPos);
    const allSpaces = [space0];
    const closestSpace = getClosestSpaceToCenter(allSpaces);
    expect(currentSpace(undefined, action, allSpaces)).toEqual(closestSpace.queryID);
  });
});
