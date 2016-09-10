export const arraySum = (array) => array.reduce(
  (curSum, curValue) => curSum + curValue,
  0);

export const arrayMean = (array) => arraySum(array) / array.length;

export const elementWithId = (array, targetId, idAttr = 'id') =>
  array.find(x => x[idAttr] === targetId);

export const indexElementWithId = (array, targetId, idAttr = 'id') =>
  array.findIndex(x => x[idAttr] === targetId);

export const getRandomElement = (array) => {
  const max = array.length;
  const index = Math.floor(Math.random() * max);
  return array[index];
};

/**
 * Emulates python's range() function
 * @param  {int} param1
 * @param  {int} param2 (optional)
 * @param  {int} param3 (optional)
 * @return {array}
 */
export const range = (param1, param2, param3) => {
  const isValid = (param) => Number.isInteger(param);
  if (isValid(param1) && isValid(param2)) {
    const step = (isValid(param3) && param3 !== 0) ? param3 : 1;
    const arrayLength = Math.max(Math.ceil((param2 - param1) / step), 0);
    return [...Array(arrayLength).keys()].map(val =>
      param1 + (val * step));
  }
  if (isValid(param1)) {
    const arrayLength = Math.max(param1, 0);
    return [...Array(arrayLength).keys()];
  }
  throw Error('Range must be called with at least one valid parameter');
};
