import deepFreeze from 'deep-freeze';
import { default as reducer, initialState } from './reducer';
import { updateDescriptor, updateQuery, updateMaxDuration,
  updateMinDuration, updateMaxResults } from './actions';
import { fetchRequest, MAP_COMPUTATION_COMPLETE, mapComputationComplete } from '../Sounds/actions';

describe('search reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('updateDescriptor', () => {
    const stateBefore = initialState;
    const descriptor = 'tonal.hpcp.mean';
    const stateAfter = Object.assign({}, stateBefore, { descriptor });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateDescriptor(descriptor))).toEqual(stateAfter);
    });
  });
  describe('updateQuery', () => {
    const stateBefore = initialState;
    const query = 'piano solo';
    const stateAfter = Object.assign({}, stateBefore, { query });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateQuery(query))).toEqual(stateAfter);
    });
  });
  describe('updateMinDuration', () => {
    const stateBefore = initialState;
    const minDuration = '5';
    const stateAfter = Object.assign({}, stateBefore, { minDuration: 5 });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateMinDuration(minDuration))).toEqual(stateAfter);
    });
  });
  describe('updateMaxDuration', () => {
    const stateBefore = initialState;
    const maxDuration = '5';
    const stateAfter = Object.assign({}, stateBefore, { maxDuration: 5 });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateMaxDuration(maxDuration))).toEqual(stateAfter);
    });
  });
  describe('updateMaxResults', () => {
    const stateBefore = initialState;
    const maxResults = '100';
    const stateAfter = Object.assign({}, stateBefore, { maxResults: 100 });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateMaxResults(maxResults))).toEqual(stateAfter);
    });
  });
  describe('isSearchEnabled', () => {
    const stateBefore = initialState;
    const stateAfter = Object.assign({}, stateBefore, { isSearchEnabled: true, activeSearches: ['123'] });
    it('correctly updates status of enabled searches', () => {
      expect(reducer(stateBefore, fetchRequest('123', '', ''))).toEqual(stateAfter);
    });
    it('correctly resets isSearchEnabled', () => {
      expect(reducer(stateAfter, mapComputationComplete('123'))).toEqual(stateBefore);
    });
  });
});
