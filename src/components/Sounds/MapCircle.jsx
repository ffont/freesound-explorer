import React from 'react';
import { lighten } from 'utils/colorsUtils';
import { mapCircles } from 'stylesheets/variables.json';
import TweenMax from 'gsap';
import './MapCircle.scss';

const propTypes = {
  sound: React.PropTypes.object,
  isSelected: React.PropTypes.bool,
  isThumbnail: React.PropTypes.bool,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  onClick: React.PropTypes.func,
};

class MapCircle extends React.Component {
  render() {
    const { color, isHovered, isPlaying } = this.props.sound;
    const { isSelected } = this.props;
    const { cx, cy } = (this.props.isThumbnail) ?
      this.props.sound.thumbnailPosition : this.props.sound.position;
    const shouldHighlight = (isHovered || isSelected || isPlaying);
    const fillColor = shouldHighlight ? lighten(color, 1.5) : color;
    const { defaultRadius, defaultStrokeWidth } = mapCircles;
    const fillWidthProportion = 2;
    const radius = parseInt(defaultRadius, 10);
    const strokeWidth = parseInt(defaultStrokeWidth, 10);
    const mapFillCircleRadius = radius / fillWidthProportion;
    const circleLength = 2 * Math.PI * (radius / fillWidthProportion);
    const completed = 0; // TODO: connect it with actual playbackPosition
    const completionOffset = (1 - (completed)) * circleLength;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={defaultRadius}
          className="MapCircle"
          fill={fillColor}
          stroke={fillColor}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
          onClick={this.props.onClick}
        />
        <circle
          cx={cx}
          cy={cy}
          r={mapFillCircleRadius}
          className="MapFillCircle"
          strokeDasharray={circleLength}
          strokeDashoffset={completionOffset}
          stroke={color}
          strokeWidth={(strokeWidth * 2) * fillWidthProportion}
        />
      </g>
    );
  }
}

MapCircle.propTypes = propTypes;
export default MapCircle;
