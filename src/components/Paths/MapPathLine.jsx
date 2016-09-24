import React from 'react';
import { DEFAULT_PATH_STROKE_WIDTH, DEFAULT_PATH_STROKE_OPACITY } from '../../constants';

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
    stroke="white"
    strokeWidth={DEFAULT_PATH_STROKE_WIDTH}
    strokeOpacity={(props.isPathPlaying) ?
      DEFAULT_PATH_STROKE_OPACITY * 10 :
      DEFAULT_PATH_STROKE_OPACITY}
  />
);

MapPathLine.propTypes = propTypes;
export default MapPathLine;
