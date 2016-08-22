import React from 'react';
import { connect } from 'react-redux';
import { playAudio, stopAudio } from '../../actions/audio';
import { DEFAULT_RADIUS, DEFAULT_FILL_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY }
  from '../../constants';

const propTypes = {
  sound: React.PropTypes.object,
  playOnHover: React.PropTypes.bool,
  playAudio: React.PropTypes.func,
  stopAudio: React.PropTypes.func,
};

class MapCircle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onMouseEnter() {
    if (this.props.playOnHover) {
      this.props.playAudio(this.props.sound);
    }
  }

  onMouseLeave() {
    if (this.props.playOnHover && this.props.sound.isPlaying) {
      this.props.stopAudio(this.props.sound);
    }
  }

  onClick() {
    if (this.props.sound.isPlaying) {
      this.props.stopAudio(this.props.sound);
    } else {
      this.props.playAudio(this.props.sound);
    }
  }

  render() {
    if (!this.props.sound.position) {
      return null;
    }
    const { cx, cy } = this.props.sound.position;
    const fillColor = this.props.sound.color;
    const strokeColor = this.props.sound.color;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={DEFAULT_RADIUS / 2}
        fill={fillColor}
        fillOpacity={DEFAULT_FILL_OPACITY}
        stroke={strokeColor}
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
  const { soundID } = ownProps;
  return (state) => {
    const sound = state.sounds.byID[soundID];
    const { playOnHover } = state.settings;
    return {
      sound,
      playOnHover,
    };
  };
};

MapCircle.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  playAudio,
  stopAudio,
})(MapCircle);
