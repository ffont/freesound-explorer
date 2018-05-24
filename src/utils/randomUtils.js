
export const randomQuery = () => {
  const queryStrings = [
    'special', 'bright', 'dull', 'metal', 'cow', 'dog', 'instruments',
    'car', 'door', 'gun', 'drums', 'scratch', 'laser', 'cat', 'percussion',
    'cartoon', 'arrow',
  ];
  return queryStrings[Math.floor(Math.random() * queryStrings.length)];
};
