// using https://github.com/uhho/density-clustering

// VARYING DENSITY
var dataset = [
  [0,0],[6,0],[-1,0],[0,1],[0,-1],
  [45,45],[45.1,45.2],[45.1,45.3],[45.8,45.5],[45.2,45.3],
  [50,50],[56,50],[50,52],[50,55],[50,51]
];
var clustering = require('density-clustering');
var optics = new clustering.OPTICS();
// parameters: 6 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
var clusters = optics.run(dataset, 6, 2);
var plot = optics.getReachabilityPlot();
console.log('cluster index: ', clusters); // , plot);
// find centroids of the clusters

function vectorSum(v1, v2) {
  const summed = [];
  if (v1 && v2 && v1.length === v2.length) {
    for (const idx in v1) {
      summed.push(v1[idx] + v2[idx]);
    }
  }
  return summed;
}

function vectorDiv(v1, v2) {
  const divided = [];
  if (typeof v2 === 'object' && v1.length === v2.length) {
    for (const idx in v1) {
      divided.push(v1[idx] / v2[idx]);
    }
  } else if (typeof v2 === 'number') {
    for (const idx in v1) {
      divided.push(v1[idx] / v2);
    }
  }
  return divided;
}


let clusterarray = [];
clusters.forEach(cluster => {
  let posarray = [];
  
  console.log('clustered positions: ', posarray);

}
)


function vectorMean(vectorArray) {
  // return (vectorDiv(vectorArray.reduce((currentValue, previousValue) => vectorSum(currentValue, previousValue), vectorArray[0].length)));
  return vectorDiv(
    vectorArray.reduce((currentValue, previousValue) => vectorSum(currentValue, previousValue)), // sum of all elements
    vectorArray[0].length // toatal amount of elements
  );
}
  // console.log('simplesum  ', Math.sum(cluster));

  // here we have an array of the centroids of the clusters
//   clusterarray.push([meanx, meany]);
// };

// console.log(vectorMean([[0,0],[6,0],[-1,0],[0,1],[0,-1]])) ;



// refactor into objects
// use actual t-sne pos of sounds
// pass collection of tags per cluster to fp mining algo

console.log('centroids of the clusters: ', clusterarray);
console.log('vectorSum: ', vectorSum([1,1],[1,-1]));
console.log('vectorDiv1: ', vectorDiv([1,2],[2,2]));
console.log('vectorDiv2: ', vectorDiv([1,2],2));
console.log('vectorMean: ', vectorMean([[1,1],[1,1]])); // true? ~~ sums right now!!??