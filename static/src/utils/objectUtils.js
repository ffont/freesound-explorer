export const getObjectPropertyTokens = (property) => {
  const strWithPeriods = property.replace(/\[(\w+)\]/g, '.$1');
  const strWithNoLeadingDot = strWithPeriods.replace(/^\./, '');
  const propertyTokens = strWithNoLeadingDot.split('.');
  return propertyTokens;
};

/* Access nested object attributes by string */
// Example usage: readObjectPropertyByPropertyAbsName(someObj, 'part3[0].name');
export const readObjectPropertyByPropertyAbsName = (obj, property) => {
  const propertyTokens = getObjectPropertyTokens(property);
  let reshapedObject = obj;
  propertyTokens.forEach((token) => {
    if (Object.keys(reshapedObject).includes(token)) {
      reshapedObject = reshapedObject[token];
    }
  });
  return reshapedObject;
};


export const pureDeleteObjectKey = (obj, property, leaveKey = false) => {
  if (leaveKey && !property) {
    return undefined;
  }
  const propertyTokens = getObjectPropertyTokens(property);
  const badKey = propertyTokens[0];
  const goodKeys = Object.keys(obj).filter(key => key !== badKey);
  const goodObj = goodKeys.reduce((curObj, curKey) =>
    Object.assign(curObj, { [curKey]: obj[curKey] }), {});
  if ((propertyTokens.length === 1 && !leaveKey) ||
    !Object.prototype.hasOwnProperty.call(obj, badKey)) {
    return goodObj;
  }
  const remainingBadKeys = propertyTokens.slice(1).join('.');
  return Object.assign(goodObj, {
    [badKey]: pureDeleteObjectKey(obj[badKey], remainingBadKeys, leaveKey) });
};
