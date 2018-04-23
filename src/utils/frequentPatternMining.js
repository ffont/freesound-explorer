
const nodeFpGrowth = require('node-fpgrowth');

export const frequentPatterns = (transactions, query, support = 0.6) => {
  const fpgrowth = new nodeFpGrowth.FPGrowth(support);
  return fpgrowth.exec(transactions).then(
      result => {
        // Exclude the query string
        const resultNoQuery = result.filter(entry => {
          // filter out plural or singular versions of the original query
          return (
            !(entry.items.includes(query)
            || entry.items.includes(query.slice(0, -1))
            || entry.items.includes(query + 's'))
          );
        });
        // sort by length of itemset
        const frequentItemsets = _.orderBy(resultNoQuery, (i) => -i.items.length);
        const tags = new Set();
        // make shure no tag is in twice & a short word & max 6 tags
        frequentItemsets.slice(0, 1)
          .forEach(itemset => itemset.items
            .forEach((item, idx) => {
              if (item.length < 15 && idx < 7) tags.add(item);
            })
          );
        return [...tags];
      }
    );
};
