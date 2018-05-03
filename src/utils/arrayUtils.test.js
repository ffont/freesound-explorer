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
  describe('vectorSum', () => {
    it('correctly returns the sum of two vectors', () => {
      const vector1 = [1, 4, 11.5];
      const vector2 = [9, -6, 9];
      const vector3 = [1, 2, 3, 4, 5, Infinity];
      const vector4 = [9, 8, 7, 6, 5, 4];
      expect(utils.vectorSum(vector1, vector2)).toEqual([10, -2, 20.5]);
      expect(utils.vectorSum(vector3, vector4)).toEqual([10, 10, 10, 10, 10, Infinity]);
    });
  });
  describe('vectorDiv', () => {
    it('correctly returns the quotient of two vectors', () => {
      const vector1 = [18, 24, 5];
      const vector2 = [9, -6, 9];
      const number1 = 3;
      const number2 = 0;
      expect(utils.vectorDiv(vector1, vector2)).toEqual([2, -4, (5 / 9)]);
      expect(utils.vectorDiv(vector2, number1)).toEqual([3, -2, 3]);
      expect(utils.vectorDiv(vector2, number2)).toEqual([Infinity, -Infinity, Infinity]);
    });
  });
  describe('vectorMean', () => {
    it('correctly returns the mean of a vector of arrays', () => {
      const vector1 = [1, 4, 11];
      const vector2 = [9, 6, 9];
      const vector3 = [1, 2, 3, 4, 5, 6];
      const vector4 = [9, -2, NaN, 6, 5, Infinity];
      expect(utils.vectorMean([vector1, vector2])).toEqual([5, 5, 10]);
      expect(utils.vectorMean([vector3, vector4])).toEqual([5, 0, NaN, 5, 5, Infinity]);
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
  describe('removeDuplicates', () => {
    it('works as expected', () => {
      expect(utils.removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
      expect(utils.removeDuplicates([1, 2, 2])).toEqual([1, 2]);
      expect(utils.removeDuplicates([])).toEqual([]);
      expect(utils.removeDuplicates([1, 1, 1, 1, 1, 1, 1])).toEqual([1]);
      expect(utils.removeDuplicates([1])).toEqual([1]);
    });
  });
  describe('range', () => {
    it('works as expected with 3 parameters', () => {
      expect(utils.range(0, 9, 3)).toEqual([0, 3, 6]);
      expect(utils.range(2, 11, 2)).toEqual([2, 4, 6, 8, 10]);
      expect(utils.range(2, 10, 2)).toEqual([2, 4, 6, 8]);
      expect(utils.range(2, 0, 4)).toEqual([]);
      expect(utils.range(10, 80, 28)).toEqual([10, 38, 66]);
      expect(utils.range(-6, -1, 2)).toEqual([-6, -4, -2]);
      expect(utils.range(-6, -1, -2)).toEqual([]);
      expect(utils.range(1, -4, -2)).toEqual([1, -1, -3]);
    });
    it('works as expected with 2 parameters', () => {
      expect(utils.range(0, 4)).toEqual([0, 1, 2, 3]);
      expect(utils.range(2, 5)).toEqual([2, 3, 4]);
      expect(utils.range(-4, -1)).toEqual([-4, -3, -2]);
    });
    it('works as expected with 1 parameter', () => {
      expect(utils.range(4)).toEqual([0, 1, 2, 3]);
      expect(utils.range(0)).toEqual([]);
    });
  });
});
