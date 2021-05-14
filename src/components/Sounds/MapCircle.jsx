import { Component } from 'react';
import PropTypes from 'prop-types';
import { lighten } from 'utils/colorsUtils';
import { mapCircles as circleStyle } from 'stylesheets/variables.json';
import TweenMax from 'gsap';
import './MapCircle.scss';

const propTypes = {
  sound: PropTypes.object,
  isSelected: PropTypes.bool,
  isThumbnail: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
};

const animationDuration = 0.5;
// length of animations that reset initial circle look
const resetAnimationDuration = 0.3;

const getCircleRadius = () => {
  const { defaultRadius } = circleStyle;
  const radius = parseInt(defaultRadius, 10);
  return radius;
};

class MapCircle extends Component {
  constructor(props) {
    super(props);
    this.tweens = { circle: undefined, filling: undefined };
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.sound.isPlaying && !this.props.sound.isPlaying) {
      this.startCircleOnPlayingAnimation();
    } else if (this.props.sound.isPlaying && !nextProps.sound.isPlaying) {
      this.stopCircleOnPlayingAnimation();
    }
  }

  startCircleOnPlayingAnimation() {
    const radius = getCircleRadius();
    this.tweens.circle = TweenMax.to(this.mapCircle, animationDuration, {
      attr: { r: radius * 2 },
      repeat: Infinity,
      yoyo: true,
    });
  }

  stopCircleOnPlayingAnimation() {
    const radius = getCircleRadius();
    if (this.tweens.circle) {
      this.tweens.circle.kill();
      // reset to initial radius
      this.tweens.circle = TweenMax.to(this.mapCircle, resetAnimationDuration, {
        attr: { r: radius },
      });
    }
  }

  render() {
    const { color, isHovered, isPlaying } = this.props.sound;
    const { isSelected } = this.props;
    const { cx, cy } = (this.props.isThumbnail) ?
      this.props.sound.thumbnailPosition : this.props.sound.position;
    // const shouldHighlight = (isHovered || isSelected || isPlaying);
    let fillColor = color;
    if (isHovered) {
      fillColor = lighten(color, 1.8);
    } else if (isSelected) {
      fillColor = lighten(color, 1.25);
    }
    const { defaultRadius, defaultStrokeWidth } = circleStyle;
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
          r={radius}
          ref={(mapCircle) => { this.mapCircle = mapCircle; }}
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
          ref={(fillingCircle) => { this.fillingCircle = fillingCircle; }}
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
