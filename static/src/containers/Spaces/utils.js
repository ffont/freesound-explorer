import { range } from '../../utils/arrayUtils';

/**
 * This function is used to compute the position that a new space will take in the map.
 * Assuming a grid and given an origin (0,0) it iterates over all 'empty' positions in
 * the grid to find the closest one and add this to a list.
 * @param  {number} n The number of spaces currently in state
 * @return {Array}    A list of n grid positions sorted by proximity to the origin
 */
export const generateListOfSpacesOriginPositions = (n) => {
  let minDistance = Infinity;
  let minI;
  let minJ;
  const usedPositions = [];
  const outPositions = [];
  range(n + 1).forEach(() => {
    range(n + 1).forEach((j) => {
      range(n + 1).forEach((i) => {
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
    minDistance = Infinity;
  });
  return outPositions;
};
