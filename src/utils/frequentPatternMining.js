
const nodeFpGrowth = require('node-fpgrowth');

export const frequentPatterns = (transactions, support = 0.4) => {
  const fpgrowth = new nodeFpGrowth.FPGrowth(support);
  return fpgrowth.exec(transactions).then(
      result => {
        // Returns both the collection of frequent itemsets sorted by support descending.
        const frequentItemsets = _.orderBy(result.itemsets, (i) => -i.support);
        const tags = new Set();
        // TODO: recursive support adjustment by length OR num of itemsets
        frequentItemsets.slice(0, 3).forEach(itemset => itemset.items.forEach(i => tags.add(i)));
        return [...tags];
      }
    );
};
