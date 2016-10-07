export const computePathname = (pathsInState) => {
  let pathName = String.fromCharCode(65 + (pathsInState.length % 26));
  if (Math.floor(pathsInState.length / 26) > 0) {
    pathName += 1 + Math.floor(pathsInState.length / 26);
  }
  return pathName;
};
