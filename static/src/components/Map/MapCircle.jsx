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
    this.buffer = undefined;
    this.playingSourceNodes = {};
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
      // undo selection and stop playing if sound is already selected
      this.props.updateSelectedSound();
      if (this.state.isPlaying) {
        this.stopAudio();
      }
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

  loadAudio(callback) {
    this.props.audioLoader.loadSound(this.props.sound.previewUrl)
      .then(
        decodedAudio => {
          this.buffer = decodedAudio;
          callback();
        }
      );
  }

  playAudio(onEndedCallback) {
    const self = this;
    function createAndStartBuffer() {
      const source = self.props.audioContext.createBufferSource();
      const sourceNodeKey = Object.keys(self.playingSourceNodes).length;
      self.playingSourceNodes[sourceNodeKey] = source;
      source.onended = () => {
        self.onAudioFinishedPLaying();
        delete self.playingSourceNodes[sourceNodeKey];
        if (onEndedCallback) {
          onEndedCallback();
        }
      };
      source.buffer = self.buffer;
      source.connect(self.props.audioContext.gainNode);
      source.start();
      self.setState({ isPlaying: true });
      return sourceNodeKey; // return reference to souce node so it can be accessed from outside
    }
    // If buffer audio has not been loaded, first load it and then play
    if (!this.buffer) {
      this.loadAudio(() => {
        createAndStartBuffer();
      });
    } else {
      createAndStartBuffer();
    }
  }

  stopAudio(sourceNodeKey = -1) {
    if (sourceNodeKey >= 0) {
      this.playingSourceNodes[sourceNodeKey].stop();  // this will trigger onended callback
    } else {
      // If no specific key provided, stop all source nodes
      Object.keys(this.playingSourceNodes).forEach((key) => {
        this.playingSourceNodes[key].stop();  // this will trigger onended callback
      });
    }
  }

  render() {
    const { cx, cy } = this.props.position;
    const fillColor = (this.props.isSelected) ? 'white' : this.props.sound.rgba;
    const strokeColor = (this.props.isSelected || this.state.isPlaying || this.state.isHovered) ?
        'white' : this.props.sound.rgba;
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
