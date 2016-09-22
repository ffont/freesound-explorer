export const getMapCenter = () => {
  const sidebarWidth = require('json!../../stylesheets/variables.json').sidebarWidth;

  return {
    x: parseInt(sidebarWidth, 10) + ((window.innerWidth - parseInt(sidebarWidth, 10)) / 2),
    y: (window.innerHeight / 2),
  };
};
