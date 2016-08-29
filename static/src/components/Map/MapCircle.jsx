import React from 'react';
import { connect } from 'react-redux';
import { playAudio, stopAudio } from '../../actions/audio';
import { selectSound, toggleHoveringSound } from '../../actions/sounds';
import { lighten } from '../../utils/colors';
import { DEFAULT_RADIUS, DEFAULT_FILL_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY }
  from '../../constants';

const propTypes = {
  sound: React.PropTypes.object,
  isThumbnail: React.PropTypes.bool,
  playOnHover: React.PropTypes.bool,
  isSelected: React.PropTypes.bool,
  playAudio: React.PropTypes.func,
  stopAudio: React.PropTypes.func,
  selectSound: React.PropTypes.func,
  toggleHoveringSound: React.PropTypes.func,
};

const isSoundVisible = (props) => {
  const position = props.sound.position;
  if (!position) {
    return false;
  }
  const isVerticallyOutOfScreen = (position.cy < -DEFAULT_RADIUS
    || position.cy > window.innerHeight + DEFAULT_RADIUS);
  const isHorizontallyOutOfScreen = (position.cx < -DEFAULT_RADIUS
    || position.cx > window.innerWidth + DEFAULT_RADIUS);
  return !(isVerticallyOutOfScreen || isHorizontallyOutOfScreen);
};

const isSoundStayingNotVisible = (currentProps, nextProps) =>
  (!isSoundVisible(currentProps) && !isSoundVisible(nextProps));

class MapCircle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return (
      ((nextProps.sound !== this.props.sound) ||
      (nextProps.isSelected !== this.props.isSelected))
      && !isSoundStayingNotVisible(this.props, nextProps)
    );
  }

  onMouseEnter() {
    if (this.props.playOnHover) {
      this.props.playAudio(this.props.sound);
    }
    this.props.toggleHoveringSound(this.props.sound.id);
  }

  onMouseLeave() {
    if (this.props.playOnHover && this.props.sound.isPlaying) {
      this.props.stopAudio(this.props.sound);
    }
    this.props.toggleHoveringSound(this.props.sound.id);
  }

  onClick() {
    if (this.props.sound.isPlaying) {
      this.props.stopAudio(this.props.sound);
    } else {
      this.props.playAudio(this.props.sound);
    }
    if (this.props.sound.isSelected) {
      this.props.selectSound();
    } else {
      this.props.selectSound(this.props.sound.id);
    }
  }

  render() {
    if (!isSoundVisible(this.props)) {
      return null;
    }
    const { position, thumbnailPosition, color, isHovered, isPlaying } = this.props.sound;
    const { isSelected } = this.props;
    if (!position) {
      return null;
    }
    const { cx, cy } = (this.props.isThumbnail) ? thumbnailPosition : position;
    const fillColor = (isHovered || isSelected || isPlaying) ? lighten(color, 1.5) : color;
    const className = (isPlaying) ? 'playing' : '';
    return (
      <circle
        cx={cx}
        cy={cy}
        r={DEFAULT_RADIUS / 2}
        fill={fillColor}
        className={className}
        fillOpacity={DEFAULT_FILL_OPACITY}
        stroke={fillColor}
        strokeWidth={DEFAULT_STROKE_WIDTH}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
      />
    );
  }
}

const makeMapStateToProps = (_, ownProps) => {
  const { soundID, isThumbnail } = ownProps;
  return (state) => {
    const sound = state.sounds.byID[soundID];
    const { selectedSound } = state.sounds;
    const { playOnHover } = state.settings;
    const isSelected = selectedSound === soundID;
    return {
      sound,
      isThumbnail,
      playOnHover,
      isSelected,
    };
  };
};

MapCircle.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  playAudio,
  stopAudio,
  selectSound,
  toggleHoveringSound,
})(MapCircle);
