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
  audioEngine: React.PropTypes.object,
  audioContext: React.PropTypes.object,
};

function computeCirclePosition(props) {
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

class MapCircle extends React.Component {
  constructor(props) {
    super(props);
    this.buffer = undefined;
    this.isPlaying = false;
    this.onHoverCallback = this.onHoverCallback.bind(this);
    this.onMouseLeaveCallback = this.onMouseLeaveCallback.bind(this);
    this.state = {
      isSelected: false,
      isPlaying: false,
    };
  }

  onHoverCallback() {
    if (!this.buffer) {
      this.props.audioEngine.loadSound(this.props.sound.previewUrl).then(
        decodedAudio => {
          this.buffer = decodedAudio;
          this.playAudio();
        },
        error => console.log(error)
      );
    } else {
      this.playAudio();
    }

    this.setState({
      isSelected: true,
    });
  }

  onMouseLeaveCallback() {
    this.setState({
      isSelected: false,
    });
  }

  playAudio() {
    const source = this.props.audioContext.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.props.audioContext.gainNode);
    source.start();
  }

  render() {
    const circleColor = (this.state.isSelected) ? 'white' : this.props.sound.rgba;
    return (
      <circle
        cx={-DEFAULT_RADIUS}
        cy={-DEFAULT_RADIUS}
        r={DEFAULT_RADIUS / 2}
        ref="circleElement"
        fill={circleColor}
        fillOpacity={DEFAULT_OPACITY}
        stroke={circleColor}
        strokeWidth={DEFAULT_STROKE_WIDTH}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
        style={computeCirclePosition(this.props)}
        onMouseEnter={this.onHoverCallback}
        onMouseLeave={this.onMouseLeaveCallback}
      />
    );
  }
}

MapCircle.propTypes = propTypes;
export default MapCircle;
