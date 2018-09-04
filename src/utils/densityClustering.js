import { DBSCAN } from 'density-clustering'; // alternative: OPTICS
import { MIN_CLUSTERS_PER_SCAN, MIN_ITEMS_PER_CLUSTER, MIN_CLUSTERS_RATIO,
  MAX_CLUSTERS_PER_SCAN, MAX_CLUSTERS_RATIO } from '../constants';

const algo = new DBSCAN();

export const computeIdxClusters = (trainingData, epsilon = 1.0, minPts = 3) => {
  const minClusters = Math.ceil(trainingData.length * MIN_CLUSTERS_RATIO || MIN_CLUSTERS_PER_SCAN)
  const maxClusters = Math.ceil(trainingData.length * MAX_CLUSTERS_RATIO) || MAX_CLUSTERS_PER_SCAN;
  const clusters = algo.run(trainingData, epsilon, minPts);
  // repeat clustering until a good cluster to num of sounds ratio is reached
  if (trainingData.length > (minClusters * MIN_ITEMS_PER_CLUSTER)) { // engough trainging Data?
    if (clusters.length < minClusters && epsilon < 2) { // too few clusters
      computeIdxClusters(trainingData, epsilon + 0.1, minPts);
    } else if (clusters.length > maxClusters && epsilon > 0.3) { // too many clusters
      computeIdxClusters(trainingData, epsilon - 0.1, minPts + 1);
    } else if (
      !clusters.every(cluster => cluster.length >= MIN_ITEMS_PER_CLUSTER)
    && minPts < trainingData.length) { // clusters too short
      computeIdxClusters(trainingData, epsilon + 0.1, minPts + 1);
    }
  }
  return clusters;
};

export const collectClusterProperties = (sourceObj, idxCluster, propName, filterfunc = () => true) => {
  const aggregator = [];
  const keyStrArray = Object.keys(sourceObj);
  idxCluster.forEach(idx => aggregator
    .push(Object.values(sourceObj[keyStrArray[idx]][propName])
    .filter(filterfunc)));
  return aggregator;
};
