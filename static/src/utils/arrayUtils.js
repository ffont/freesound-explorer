export const arraySum = (array) => array.reduce(
  (curSum, curValue) => curSum + curValue,
  0);

export const arrayMean = (array) => arraySum(array) / array.length;

export const elementWithId = (array, targetId) => array.find(x => x.id === targetId);

export const indexElementWithId = (array, targetId) => array.findIndex(x => x.id === targetId);
