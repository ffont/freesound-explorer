import expect from 'expect';
import * as utils from './objectUtils';

describe('object utils', () => {
  describe('getObjectPropertyTokens', () => {
    it('correctly returns all the tokens in property', () => {
      const property = 'x.abc.y.d';
      const expectedTokens = ['x', 'abc', 'y', 'd'];
      const property2 = 'x[0].abc.y';
      const expectedTokens2 = ['x', '0', 'abc', 'y'];
      expect(utils.getObjectPropertyTokens(property)).toEqual(expectedTokens);
      expect(utils.getObjectPropertyTokens(property2)).toEqual(expectedTokens2);
    });
  });
  describe('readObjectPropertyByPropertyAbsName', () => {
    it('correctly returns the property value of an object', () => {
      const x = { a: [22, { b: 3 }] };
      expect(utils.readObjectPropertyByPropertyAbsName(x, 'a[1].b')).toEqual(3);
      expect(utils.readObjectPropertyByPropertyAbsName(x, 'a.1.b')).toEqual(3);
    });
  });
});
