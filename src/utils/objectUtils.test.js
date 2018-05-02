import deepFreeze from 'deep-freeze';
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
  describe('pureDeleteObjectKey', () => {
    const testObj = { x: 1, y: { a: 4, b: [3, 4, 5], c: { d: 1 } } };
    deepFreeze(testObj);
    it('correctly removes properties without changing the original object', () => {
      const testProp = 'y.b';
      const expectedOutput = { x: 1, y: { a: 4, c: { d: 1 } } };
      expect(utils.pureDeleteObjectKey(testObj, testProp)).toEqual(expectedOutput);
      const testProp2 = 'y';
      const expectedOutput2 = { x: 1 };
      expect(utils.pureDeleteObjectKey(testObj, testProp2)).toEqual(expectedOutput2);
    });
    it('correcly handles unexisting properties', () => {
      const testProp = 'z.d';
      expect(utils.pureDeleteObjectKey(testObj, testProp)).toEqual(testObj);
      const testProp2 = 'y.d';
      const leaveKey = true;
      // a non-existing key should not be "left" on the object
      expect(utils.pureDeleteObjectKey(testObj, testProp2, leaveKey)).toEqual(testObj);
    });
    it('works as expected with leaveKey parameter', () => {
      const leaveKey = true;
      const testProp = 'y.b';
      const expectedOutput = { x: 1, y: { a: 4, b: undefined, c: { d: 1 } } };
      expect(utils.pureDeleteObjectKey(testObj, testProp, leaveKey)).toEqual(expectedOutput);
    });
  });
});
