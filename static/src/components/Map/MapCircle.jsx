import React from 'react';
import { DEFAULT_RADIUS, DEFAULT_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY,
  MAP_SCALE_FACTOR }
  from '../../constants';

const propTypes = {
  sound: React.PropTypes.object,
  translateX: React.PropTypes.number,
  translateY: React.PropTypes.number,
  scale: React.PropTypes.number,
  positionInTsneSolution: React.PropTypes.array,
  windowWidth: React.PropTypes.number,
  windowHeight: React.PropTypes.number,
};

function computeCircleTranslation(props) {
  const translateX = (props.positionInTsneSolution[0] +
    (props.windowWidth / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * props.scale + props.translateX;
  const translateY = (props.positionInTsneSolution[1] +
    (props.windowHeight / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * props.scale + props.translateY;
  return {
    transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
    mixBlendMode: 'screen',
  };
}

function MapCircle(props) {
  return (
    <circle
      cx={-DEFAULT_RADIUS}
      cy={-DEFAULT_RADIUS}
      r={DEFAULT_RADIUS / 2}
      fill={props.sound.rgba}
      fillOpacity={DEFAULT_OPACITY}
      stroke={props.sound.rgba}
      strokeWidth={DEFAULT_STROKE_WIDTH}
      strokeOpacity={DEFAULT_STROKE_OPACITY}
      style={computeCircleTranslation(props)}
    />
);
}

MapCircle.propTypes = propTypes;
export default MapCircle;
