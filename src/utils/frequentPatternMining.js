
// modified version of https://codepen.io/ccallen001/pen/YGOzRA
function mostFreqStr(arr) {
  // ERROR HANDLING
  // more than one argument passed
  if (arguments.length > 1) {
    return console.log("Sorry, you may only pass one array of strings to mostFreqStr.");
  }
  // the argument is not an array OR if it's empty
  if (!Array.isArray(arr) || arr.length < 1) {
    return console.log("Sorry, you may only pass an array of strings to mostFreqStr.");
  }
  // an element in arr is not a string
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== "string") {
      return console.log(`Sorry, element at index ${i} is not a string.`);
    }
  }
  
  var obj = {};
  var mostFreq = 0;
  var which = [];

  // convert all strings to lower case
  const lcArr = [];
  arr.forEach(e => lcArr.push(e.toLowerCase()));

  lcArr.forEach(ea => {
    if (!obj[ea]) {
      obj[ea] = 1;
    } else {
      obj[ea]++;
    }

    if (obj[ea] > mostFreq) {
      mostFreq = obj[ea];
      which = [ea];
    } else if (obj[ea] === mostFreq) {
      which.push(ea);
    }
  });
  return which;
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
          || entry === query.slice(0, -1)
          || entry === `${query}s`
          || entry === `${query}ing`
          || arr.includes(`${entry}s`)
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
    }
    catch (e) {
      console.log(e);
      reject([]);
    }
  });
};
