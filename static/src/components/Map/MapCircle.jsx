import React from 'react';
import { DEFAULT_RADIUS, DEFAULT_FILL_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY }
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
  playOnHover: React.PropTypes.bool,
};


class MapCircle extends React.Component {
  constructor(props) {
    super(props);
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
    if (this.props.playOnHover) {
      this.playAudio();
    }
    this.setState({ isHovered: true });
  }

  onMouseLeaveCallback() {
    this.setState({ isHovered: false });
  }

  onClickCallback() {
    if (this.props.isSelected) {
      // undo selection if sound is already selected
      this.props.updateSelectedSound();
    } else {
      this.props.updateSelectedSound(this.props.sound.id);
      if (!this.props.playOnHover) {
        this.playAudio();
      }
    }
  }

  onAudioFinishedPLaying() {
    this.setState({ isPlaying: false });
  }

  createAndStartBuffer() {
    const source = this.props.audioContext.createBufferSource();
    source.onended = () => {
      this.onAudioFinishedPLaying();
      // TODO: this method should return a promise that resolves here
    };
    source.buffer = this.props.sound.buffer;
    source.connect(this.props.audioContext.gainNode);
    source.start();
    this.setState({ isPlaying: true });
  }

  loadAudio() {
    return new Promise((resolve, reject) => {
      this.props.audioLoader.loadSound(this.props.sound.previewUrl)
      .then(
        decodedAudio => resolve(decodedAudio),
        error => reject(error)
      );
    });
  }

  playAudio() {
    // If buffer audio has not been loaded, first load it and then play
    if (!this.props.sound.buffer) {
      this.loadAudio().then((decodedAudio) => {
        this.props.sound.buffer = decodedAudio;
        this.createAndStartBuffer();
      });
    } else {
      this.createAndStartBuffer();
    }
  }

  render() {
    const { cx, cy } = this.props.position;
    const fillColor = (this.props.isSelected) ? 'white' : this.props.sound.color;
    const strokeColor = (this.props.isSelected || this.state.isPlaying || this.state.isHovered) ?
        'white' : this.props.sound.color;
    const animationValues = `${DEFAULT_RADIUS / 2}; ${DEFAULT_RADIUS / 1.5}; ${DEFAULT_RADIUS / 2}`;
    const animation = (this.state.isPlaying) ?
      <animate
        attributeName="r"
        begin="0s"
        dur="1s"
        repeatCount="indefinite"
        values={animationValues}
        keyTimes="0; 0.5; 1"
      /> : false;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={DEFAULT_RADIUS / 2}
        ref="circleElement"
        fill={fillColor}
        fillOpacity={DEFAULT_FILL_OPACITY}
        stroke={strokeColor}
        strokeWidth={DEFAULT_STROKE_WIDTH}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
        onMouseEnter={this.onHoverCallback}
        onMouseLeave={this.onMouseLeaveCallback}
        onClick={this.onClickCallback}
      >{animation}</circle>
    );
  }
}

MapCircle.propTypes = propTypes;
export default MapCircle;
