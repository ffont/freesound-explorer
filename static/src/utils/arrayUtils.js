export const arraySum = (array) => array.reduce(
  (curSum, curValue) => curSum + curValue,
  0);

export const arrayMean = (array) => arraySum(array) / array.length;

export const elementWithId = (array, targetId, idAttr = 'id') =>
  array.find(x => x[idAttr] === targetId);

export const indexElementWithId = (array, targetId, idAttr = 'id') =>
  array.findIndex(x => x[idAttr] === targetId);
