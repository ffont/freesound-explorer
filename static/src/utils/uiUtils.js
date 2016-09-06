import { sidebarWidth, sidebarClosedOffset, sidebarContentPadding, thumbnailHeight }
  from 'json!../stylesheets/variables.json';
import { DEFAULT_RADIUS } from '../constants';

export const getMapCenter = () => ({
  x: parseInt(sidebarWidth, 10) + ((window.innerWidth - parseInt(sidebarWidth, 10)) / 2),
  y: (window.innerHeight / 2),
});

export const thumbnailSize = {
  width: parseInt(sidebarWidth, 10) - parseInt(sidebarClosedOffset, 10) -
    (2 * (parseInt(sidebarContentPadding, 10))),
  height: parseInt(thumbnailHeight, 10),
};

export const isSoundInsideScreen = (position, isThumbnail = false) => {
  if (!position) {
    return false;
  }
  const screenWidth = (isThumbnail) ? thumbnailSize.width : window.innerWidth;
  const screenHeight = (isThumbnail) ? thumbnailSize.height : window.innerHeight;
  const isVerticallyOutOfScreen = (position.cy < -DEFAULT_RADIUS
    || position.cy > screenHeight + DEFAULT_RADIUS);
  const isHorizontallyOutOfScreen = (position.cx < -DEFAULT_RADIUS
    || position.cx > screenWidth + DEFAULT_RADIUS);
  return !(isVerticallyOutOfScreen || isHorizontallyOutOfScreen);
};
