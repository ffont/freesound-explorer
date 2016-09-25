import React from 'react';
import { paths } from 'stylesheets/variables.json';

const propTypes = {
  x1: React.PropTypes.number,
  y1: React.PropTypes.number,
  x2: React.PropTypes.number,
  y2: React.PropTypes.number,
  isPathPlaying: React.PropTypes.bool,
};

const MapPathLine = props => (
  <line
    x1={props.x1}
    y1={props.y1}
    x2={props.x2}
    y2={props.y2}
    className="MapPathLine"
    stroke="white"
    strokeOpacity={(props.isPathPlaying) ?
      paths.defaultStrokeOpacity * 10 :
      paths.defaultStrokeOpacity}
  />
);

MapPathLine.propTypes = propTypes;
export default MapPathLine;
