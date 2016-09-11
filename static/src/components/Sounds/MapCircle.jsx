import React from 'react';
import { lighten } from '../../utils/colors';
import { DEFAULT_RADIUS, DEFAULT_FILL_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY }
  from '../../constants';
import './MapCircle.scss';

const propTypes = {
  sound: React.PropTypes.object,
  isSelected: React.PropTypes.bool,
  isThumbnail: React.PropTypes.bool,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  onClick: React.PropTypes.func,
};

const MapCircle = (props) => {
  const { color, isHovered, isPlaying } = props.sound;
  const { isSelected } = props;
  const { cx, cy } = (props.isThumbnail) ?
    props.sound.thumbnailPosition : props.sound.position;
  const fillColor = (isHovered || isSelected || isPlaying) ? lighten(color, 1.5) : color;
  const className = `main-circle${(isPlaying) ? ' playing' : ''}`;
  const fillCircleClassName = `play-fill-circle${(isPlaying) ? ' playing' : ''}`;
  const radius = DEFAULT_RADIUS / 2;
  const fillWidthProportion = 2;
  const circleLength = 2 * Math.PI * (radius / fillWidthProportion);
  const completed = 0; // TODO: connect it with actual playbackPosition
  const completionOffset = (1 - (completed)) * circleLength;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fillColor}
        className={className}
        fillOpacity={DEFAULT_FILL_OPACITY}
        stroke={fillColor}
        strokeWidth={DEFAULT_STROKE_WIDTH}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius / fillWidthProportion}
        className={fillCircleClassName}
        strokeDasharray={circleLength}
        strokeDashoffset={completionOffset}
        stroke={color}
        strokeWidth={(DEFAULT_STROKE_WIDTH * 2) * fillWidthProportion}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
      />
    </g>
  );
};

MapCircle.propTypes = propTypes;
export default MapCircle;
