import expect from 'expect';
import * as utils from './arrayUtils';

describe('array utils', () => {
  describe('arraySum', () => {
    it('correctly returns sum of array', () => {
      const array1 = [0, 4, 10];
      const array2 = [Infinity, 4, 20];
      expect(utils.arraySum(array1)).toEqual(14);
      expect(utils.arraySum(array2)).toEqual(Infinity);
    });
  });
  describe('arrayMean', () => {
    it('correctly returns mean of array', () => {
      const array1 = [1, 4, 10];
      const array2 = [Infinity, 4, 20];
      expect(utils.arrayMean(array1)).toEqual(5);
      expect(utils.arrayMean(array2)).toEqual(Infinity);
    });
  });
  describe('elementWithId', () => {
    it('correctly returns object in array that matches id', () => {
      const list = [{ id: 2 }, { id: 10 }, { id: 400 }];
      expect(utils.elementWithId(list, 10)).toEqual({ id: 10 });
    });
    it('works with custom id property', () => {
      const list = [{ id: 2, name: '23' }, { id: 10, name: '30' }, { id: 400, name: '55' }];
      expect(utils.elementWithId(list, '23', 'name')).toEqual({ id: 2, name: '23' });
    });
  });
  describe('indexElementWithId', () => {
    it('correctly returns index of object in array that matches id', () => {
      const list = [{ id: 2 }, { id: 10 }, { id: 400 }];
      expect(utils.indexElementWithId(list, 10)).toEqual(1);
    });
    it('works with custom id property', () => {
      const list = [{ id: 2, name: '23' }, { id: 10, name: '30' }, { id: 400, name: '55' }];
      expect(utils.indexElementWithId(list, '23', 'name')).toEqual(0);
    });
  });
});
