
// modified version of https://codepen.io/ccallen001/pen/YGOzRA
function mostFreqStr(arr) {
  // returns most frequent keys descending by values

  // ERROR HANDLING
  // more than one argument passed
  if (arguments.length > 1) {
    return console.log('Sorry, you may only pass one array of strings to mostFreqStr.');
  }
  // the argument is not an array OR if it's empty
  if (!Array.isArray(arr) || arr.length < 1) {
    return console.log('Sorry, you may only pass an array of strings to mostFreqStr.');
  }
  // an element in arr is not a string
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'string') {
      return console.log(`Sorry, element at index ${i} is not a string.`);
    }
  }

  const obj = {};
  // convert all strings to lower case
  const lcArr = [];
  arr.forEach(e => lcArr.push(e.toLowerCase()));
  // count occurencies
  lcArr.forEach(ea => {
    if (!obj[ea]) {
      obj[ea] = 1;
    } else {
      obj[ea] += 1;
    }
  });
  // array descending
  return Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
}

export const frequentPatterns = (transactions, query) => {
  return new Promise((resolve, reject) => {
    try {
      const frequent = mostFreqStr(_.flatten(transactions));
      const result = frequent.filter((entry, _, arr) => {
        // filter out plural or singular versions of the original query or any entry
        // saves the plural versions rather than singular ones, covering a few irregular
        return (
          !(entry === query
          || query.split(/\W/).includes(entry) // any terms in the query
          || query.split(/\W/).map(e => e.slice(0, -2)).includes(`${entry}`)
          || query.split(/\W/).map(e => `${e}ing`).includes(`${entry}`)
          || query.split(/\W/).map(e => `${e}s`).includes(`${entry}`)
          || query.split(/\W/).map(e => `${e}ed`).includes(`${entry}`)
          || arr.includes(`${entry}s`) // variants of exisiting base terms
          || arr.includes(`${entry}ing`)
          || arr.includes(`${entry}oes`)
          || arr.includes(`${entry}en`)
          || arr.includes(`${entry}ren`)
          || arr.includes(`${entry.slice(0, -1)}ves`)
          || arr.includes(`${entry.slice(0, -2)}ves`)
          )
        );
      });
      if (result.length) {
        resolve(result.slice(0, 5));
      } else resolve([]);
    } catch (e) {
      console.log(e);
      reject([]);
    }
  });
};
