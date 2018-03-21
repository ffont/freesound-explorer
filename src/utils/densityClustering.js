import { MIN_CLUSTERS_PER_SCAN, MIN_ITEMS_PER_CLUSTER, MAX_CLUSTERS_PER_SCAN } from '../constants';

const clustering = require('density-clustering');

const algo = new clustering.DBSCAN();

// TODO: return soundID array
export const computeIdxClusters = (trainingData, epsilon = 0.9, minPts = 4) => {
  if (minPts < 1) minPts = 1;
  const clusters = algo.run(trainingData, epsilon, minPts);
  if (trainingData.length > (MIN_CLUSTERS_PER_SCAN * MIN_ITEMS_PER_CLUSTER)) {
    if (clusters.length < MIN_CLUSTERS_PER_SCAN && epsilon < 2) {
      computeIdxClusters(trainingData, epsilon + 0.1, minPts);
    } else if (clusters.length > MAX_CLUSTERS_PER_SCAN && epsilon > 0.3) {
      computeIdxClusters(trainingData, epsilon - 0.1, minPts);
    } else if (clusters.every(c => c.length > 3) && minPts > 1) {
      computeIdxClusters(trainingData, epsilon, minPts - 1);
    }
  }
  return clusters;
};
