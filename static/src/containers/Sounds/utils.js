import { MAP_SCALE_FACTOR } from '../../constants';

export const computeSoundGlobalPosition = (tsnePosition, spacePosition, mapPosition) => {
  const { translateX, translateY, scale } = mapPosition;
  const cx = ((tsnePosition.x + (window.innerWidth / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.x) + translateX;
  const cy = ((tsnePosition.y + (window.innerHeight / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.y) + translateY;
  return { cx, cy };
};
