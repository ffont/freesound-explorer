import React from 'react';
import { DEFAULT_RADIUS, DEFAULT_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY,
  MAP_SCALE_FACTOR }
  from '../../constants';
import freesound from '../../vendors/freesound';

const propTypes = {
  sound: React.PropTypes.object,
  isSelected: React.PropTypes.bool,
  updateSelectedSound: React.PropTypes.func,
  mapZoom: React.PropTypes.shape({
    translateX: React.PropTypes.number,
    translateY: React.PropTypes.number,
    scale: React.PropTypes.number,
  }),
  positionInTsneSolution: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }),
  windowSize: React.PropTypes.shape({
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
  }),
  audioLoader: React.PropTypes.object,
  audioContext: React.PropTypes.object,
};

function computeCirclePosition(props) {
  const { windowWidth, windowHeight } = props.windowSize;
  const translateX = (props.positionInTsneSolution.x +
    (windowWidth / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * props.mapZoom.scale + props.mapZoom.translateX;
  const translateY = (props.positionInTsneSolution.y +
    (windowHeight / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * props.mapZoom.scale + props.mapZoom.translateY;
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
    // case 2: new solution computed
    if (this.props.positionInTsneSolution.x !== nextProps.positionInTsneSolution.x ||
      this.props.positionInTsneSolution.y !== nextProps.positionInTsneSolution.y) {
      return true;
    }
    // case 3: interaction with map (zoom, move)
    if (this.props.mapZoom.translateX !== nextProps.mapZoom.translateX ||
      this.props.mapZoom.translateY !== nextProps.mapZoom.translateY ||
      this.props.mapZoom.scale !== nextProps.mapZoom.scale) {
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

  bookmarkSound() {
    freesound.setToken(sessionStorage.getItem('access_token'), 'oauth');
    const sound = this.props.sound;
    const successCallback = () => console.log('Sound bookmarked!');
    const errorCallback = () => console.log('Error bookmarking sound...');
    sound.fsObject.bookmark(
      sound.name,  // Use sound name
      'Freesound Explorer',  // Category
      successCallback,
      errorCallback
    );
  }

  render() {
    const circleColor = (this.props.isSelected || this.state.isHovered) ?
      'white' : this.props.sound.rgba;
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
        onClick={this.onClickCallback}
      />
    );
  }
}

MapCircle.propTypes = propTypes;
export default MapCircle;
