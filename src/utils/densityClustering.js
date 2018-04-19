import { DBSCAN } from 'density-clustering'; // alternative: OPTICS
import { MIN_CLUSTERS_PER_SCAN, MIN_ITEMS_PER_CLUSTER,
  MAX_CLUSTERS_PER_SCAN, MAX_CLUSTERS_RATIO } from '../constants';

const algo = new DBSCAN();

// TODO: return soundID array
export const computeIdxClusters = (trainingData, epsilon = 0.9, minPts = 3) => {
  const maxClusters = Math.ceil(trainingData.length * MAX_CLUSTERS_RATIO) || MAX_CLUSTERS_PER_SCAN;
  if (minPts < 1) minPts = 1;
  const clusters = algo.run(trainingData, epsilon, minPts);
  // repeat clustering until a good cluster to num of sounds ratio is reached
  if (trainingData.length > (MIN_CLUSTERS_PER_SCAN * MIN_ITEMS_PER_CLUSTER)) {
    if (clusters.length < MIN_CLUSTERS_PER_SCAN && epsilon < 2) {
      computeIdxClusters(trainingData, epsilon + 0.1, minPts);
    } else if (clusters.length > maxClusters && epsilon > 0.3) {
      computeIdxClusters(trainingData, epsilon - 0.1, minPts);
    } else if (clusters.every(c => c.length > 3) && minPts > 1) {
      computeIdxClusters(trainingData, epsilon, minPts - 1);
    }
  }
  return clusters;
};
