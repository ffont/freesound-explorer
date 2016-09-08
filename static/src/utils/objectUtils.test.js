import expect from 'expect';
import deepFreeze from 'deep-freeze';
import '../polyfills/Object.assign';
import * as utils from './objectUtils';

describe('object utils', () => {
  describe('getObjectPropertyTokens', () => {
    it('correctly returns all the tokens in property', () => {
      const property = 'x.abc.y.d';
      const expectedTokens = ['x', 'abc', 'y', 'd'];
      expect(utils.getObjectPropertyTokens(property)).toEqual(expectedTokens);
    });
  });
});
