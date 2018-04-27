
// https://codepen.io/ccallen001/pen/YGOzRA
function mostFreqStr(arr) {
  //ERROR HANDLING
  //more than one argument passed
  if (arguments.length > 1) {
    return console.log("Sorry, you may only pass one array of strings to mostFreqStr.");
  }
  //the argument is not an array OR if it's empty
  if (!Array.isArray(arr) || arr.length < 1) {
    return console.log("Sorry, you may only pass an array of strings to mostFreqStr.");
  }
  //an element in arr is not a string
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== "string") {
      return console.log(`Sorry, element at index ${i} is not a string.`);
    }
  }
  
  var obj = {}, mostFreq = 0, which = [];

  arr.forEach(ea => {
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
      const resultNoQuery = frequent.filter(entry => {
        // filter out plural or singular versions of the original query
        return (
          !(entry === query
          || entry === query.slice(0, -1)
          || entry === query + 's')
        );
      });
      if (resultNoQuery.length) {
        resolve(resultNoQuery.slice(0, 5));
      } else resolve([]);
    }
    catch (e) {
      console.log(e);
      reject([]);
    }
  });
};
