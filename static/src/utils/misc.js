import '../polyfills/Array.includes';
import { arrayMean } from './arrayUtils';

export const loadJSON = (url) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
      resolve(xhr.response);
    } else {
      reject();
    }
  };
  xhr.onerror = () => reject();
  xhr.send();
});

/* Access nested object attributes by string */
// Example usage: readObjectByString(someObj, 'part3[0].name');
export const readObjectByString = (obj, str) => {
  const strWithPeriods = str.replace(/\[(\w+)\]/g, '.$1');
  const strWithNoLeadingDot = strWithPeriods.replace(/^\./, '');
  const strTokens = strWithNoLeadingDot.split('.');
  let reshapedObject = obj;
  strTokens.forEach(token => {
    if (Object.keys(reshapedObject).includes(token)) {
      reshapedObject = reshapedObject[token];
    }
  });
  return reshapedObject;
};

export const getRandomElement = (array) => {
  const max = array.length;
  const index = Math.floor(Math.random() * max);
  return array[index];
};

export const downsampleSignal = (signal, numberOfPoints = 50) => {
  const iteratorSize = Math.ceil((signal.length / numberOfPoints));
  const points = [...Array(numberOfPoints).keys()];
  const downsampledSignal = points.map(pointIndex => {
    const slicedArray = signal.slice(pointIndex * iteratorSize, (pointIndex + 1) * iteratorSize);
    return arrayMean(slicedArray);
  });
  return downsampledSignal;
};
