export const arraySum = (array) => array.reduce(
  (curSum, curValue) => curSum + curValue,
  0);

export const arrayMean = (array) => arraySum(array) / array.length;
