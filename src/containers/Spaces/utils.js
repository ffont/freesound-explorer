import { range, vectorMean } from 'utils/arrayUtils';
import { computeSoundGlobalPosition } from '../Sounds/utils';
import { getMapCenter } from '../Map/utils';
import { computeIdxClusters, collectClusterProperties } from '../../utils/densityClustering';
import { frequentPatterns } from '../../utils/frequentPatternMining';

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

export const computeSpacePosition = (spaceIndex) => {
  const { x, y } = generateListOfSpacesOriginPositions(spaceIndex)[spaceIndex];
  return { x: (4 * x) + 1, y: (4 * y) + 1 };
};

export const computeSpacePositionInMap = (spacePosition, mapPosition) => {
  const tsnePosition = { x: 0, y: 0 };
  const { cx, cy } = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
  return {
    x: cx,
    y: cy,
  };
};

/**
 * Returns the smallest non-negative integer which is not already
 * taken as an index of any of existing spaces
 * @param  {array} spaces The list of space-objects
 * @return {number}       The first index not already taken
 */
export const computeSpaceIndex = (spaces) => {
  const usedSpaceIndexes = [];
  spaces.forEach((space) => {
    usedSpaceIndexes.push(space.spaceIndex);
  });
  let spaceIndex = 0;
  let found = false;
  while (!found) {
    if (!usedSpaceIndexes.includes(spaceIndex)) {
      found = true;
    } else {
      spaceIndex += 1;
    }
  }
  return spaceIndex;
};

export const getCurrentSpaceObj = function(spaces, queryID) {
  let currentSpace = {};
  for (const space of spaces) {
    if (space.queryID === queryID) {
      currentSpace = space;
    }
  }
  return currentSpace;
};

export const getSpaceDistanceToCenter = (space, center) =>
  Math.sqrt(Math.pow((space.currentPositionInMap.x - center.x), 2) +
    Math.pow((space.currentPositionInMap.y - center.y), 2));

export const getClosestSpaceToCenter = (allSpaces) => {
  let minDistance = Infinity;
  const mapCenter = getMapCenter();
  return allSpaces.reduce((curState, curSpace) => {
    const distanceToCenter = getSpaceDistanceToCenter(curSpace, mapCenter);
    if (distanceToCenter < minDistance) {
      minDistance = distanceToCenter;
      return curSpace;
    }
    return curState;
  }, undefined);
};

export const computeClustersFromTsnePos = (soundObjects, space, mapPosition) => {
  const initialCluster = {
    centroid: { x: 0, y: 0 },
    clusterPosition: { cx: 0, cy: 0 },
    freqTags: [],
    sounds: [],
  };

  const { spaceIndex } = space;
  const spacePosition = computeSpacePosition(spaceIndex);
  const trainingData = Object.keys(soundObjects).map(
    soundID => Object.values(soundObjects[soundID].tsnePosition));
  const soundIdxClusters = computeIdxClusters(trainingData);
  const soundIDs = Object.keys(soundObjects);

  const clusterCentroid = idxCluster => {
    const cp = vectorMean(collectClusterProperties(soundObjects, idxCluster, 'tsnePosition'));
    return { x: cp[0], y: cp[1] };
  };

  // for filtering out unwanted tags
  const tagFilter = (tag, _, taglist) => {
    return (
      !(tag.length < 3) // super short tags
      && !/\d/.test(tag) // tags with digits
      && !(taglist.includes(tag + 's') || taglist.includes(tag.slice(0, -1)))  // plural versions
    );
  };

  // getFrequentTags :: ([Obj], [[Int]], Str) -> [[Str]] -> [Str]
  const getFrequentTags = (idxCluster) => {
    // collect all tags of a cluster excluding numbers and mine frequent items
    return frequentPatterns(
      collectClusterProperties(soundObjects, idxCluster, 'tags', tagFilter), space.query);
  };

  // each cluster is a Promise!
  const makeClusterObject = idxCluster => {
    const centroid = clusterCentroid(idxCluster);
    const clusterPosition = computeSoundGlobalPosition(centroid, spacePosition, mapPosition);
    const sounds = [];
    idxCluster.forEach(idx => sounds.push(soundIDs[idx]));
    return getFrequentTags(idxCluster)
      .then(freqTags => Object.assign({}, initialCluster, {
        centroid,
        clusterPosition,
        sounds,
        freqTags,
      }));
  };

  // cluster Array is a Promise Array
  const clusterArray = [];
  soundIdxClusters.forEach(idxCluster => clusterArray.push(makeClusterObject(idxCluster)));
  return Promise.all(clusterArray);
};
