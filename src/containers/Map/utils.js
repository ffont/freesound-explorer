import { sidebarWidth } from '../../stylesheets/variables.json';

export const getMapCenter = () => ({
  x: parseInt(sidebarWidth, 10) + ((window.innerWidth - parseInt(sidebarWidth, 10)) / 2),
  y: (window.innerHeight / 2),
});
