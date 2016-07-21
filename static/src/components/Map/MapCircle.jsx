import React from 'react';
import { DEFAULT_RADIUS, DEFAULT_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY }
  from '../../constants';

const propTypes = {
  sound: React.PropTypes.object,
  isSelected: React.PropTypes.bool,
  updateSelectedSound: React.PropTypes.func,
  position: React.PropTypes.shape({
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
  }),
  audioLoader: React.PropTypes.object,
  audioContext: React.PropTypes.object,
};


class MapCircle extends React.Component {
  constructor(props) {
    super(props);
    this.buffer = undefined;
    this.isPlaying = false;
    this.onHoverCallback = this.onHoverCallback.bind(this);
    this.onMouseLeaveCallback = this.onMouseLeaveCallback.bind(this);
    this.onClickCallback = this.onClickCallback.bind(this);
    this.state = {
      isHovered: false,
      isPlaying: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // case 1: state updated
    if (this.state !== nextState) {
      return true;
    }
    // case 2: new position
    if (this.props.position.cx !== nextProps.position.cx ||
      this.props.position.cy !== nextProps.position.cy) {
      return true;
    }
    if (this.props.isSelected !== nextProps.isSelected) {
      return true;
    }
    return false;
  }

  onHoverCallback() {
    if (!this.buffer) {
      this.props.audioLoader.loadSound(this.props.sound.previewUrl)
        .then(
          decodedAudio => {
            this.buffer = decodedAudio;
            this.playAudio();
          }
        );
    } else {
      this.playAudio();
    }
    this.setState({
      isHovered: true,
    });
  }

  onMouseLeaveCallback() {
    this.setState({
      isHovered: false,
    });
  }

  onClickCallback() {
    if (this.props.isSelected) {
      // undo selection if sound is already selected
      this.props.updateSelectedSound();
    } else {
      this.props.updateSelectedSound(this.props.sound.id);
    }
  }

  playAudio() {
    const source = this.props.audioContext.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.props.audioContext.gainNode);
    source.start();
  }

  render() {
    const circleColor = (this.props.isSelected || this.state.isHovered) ?
      'white' : this.props.sound.rgba;
    const { cx, cy } = this.props.position;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={DEFAULT_RADIUS / 2}
        ref="circleElement"
        fill={circleColor}
        fillOpacity={DEFAULT_OPACITY}
        stroke={circleColor}
        strokeWidth={DEFAULT_STROKE_WIDTH}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
        onMouseEnter={this.onHoverCallback}
        onMouseLeave={this.onMouseLeaveCallback}
        onClick={this.onClickCallback}
      />
    );
  }
}

MapCircle.propTypes = propTypes;
export default MapCircle;
