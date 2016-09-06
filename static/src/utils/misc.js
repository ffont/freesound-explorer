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

export const truncatedString = (string, length = 40, extraChars = '...') => {
  let newString = string.substr(0, length);
  if (string.length > length) {
    newString += extraChars;
  }
  return newString;
};

export const generateListOfSpacesOriginPositions = (n) => {
  /*
  This function is used to compute the position that a new space will take in the map.
  Assuming a grid and given an origin (0,0) it iterates over all 'empty' positions in the grid
  to find the closest one and add this to a list.
  The function returns a list of n grid positions sorted by proximity to the origin.
  */
  let minDistance = 9999999999;
  let minI;
  let minJ;
  const usedPositions = [];
  const outPositions = [];
  [...Array(n + 1).keys()].forEach(() => {
    [...Array(n + 1).keys()].forEach((j) => {
      [...Array(n + 1).keys()].forEach((i) => {
        if (!usedPositions.includes(`${i}_${j}`)) {
          const dist = Math.sqrt((i * i) + (j * j));
          if (dist < minDistance) {
            minDistance = dist;
            minI = i;
            minJ = j;
          }
        }
      });
    });
    outPositions.push({ x: minI, y: minJ });
    usedPositions.push(`${minI}_${minJ}`);
    minDistance = 9999999999;
  });
  return outPositions;
};
