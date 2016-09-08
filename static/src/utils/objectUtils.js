export const removeObjectProperties = (obj, props) => {
  const removeObjectProp = (property) => {
  };
  if (Array.isArray(props)) {
    props.forEach(prop => removeObjectProp(prop));
  } else if (typeof props === 'string') {
    return removeObjectProp(props);
  }
  return obj;
};

export const getObjectPropertyTokens = (property) => {
  const strWithPeriods = property.replace(/\[(\w+)\]/g, '.$1');
  const strWithNoLeadingDot = strWithPeriods.replace(/^\./, '');
  const propertyTokens = strWithNoLeadingDot.split('.');
  return propertyTokens;
};

export const removeObjectProp = (property) => {
  const propertyTokens = getObjectPropertyTokens(property);
};

/* Access nested object attributes by string */
// Example usage: readObjectPropertyByPropertyAbsName(someObj, 'part3[0].name');
export const readObjectPropertyByPropertyAbsName = (obj, property) => {
  const propertyTokens = getObjectPropertyTokens(property);
  let reshapedObject = obj;
  propertyTokens.forEach(token => {
    if (Object.keys(reshapedObject).includes(token)) {
      reshapedObject = reshapedObject[token];
    }
  });
  return reshapedObject;
};
