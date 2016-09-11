import React from 'react';
import { connect } from 'react-redux';
import { playAudio, stopAudio } from '../Audio/actions';
import { selectSound, toggleHoveringSound } from './actions';
import MapCircle from '../../components/Sounds/MapCircle';
import { lighten } from '../../utils/colors';
import { isSoundInsideScreen } from '../../utils/uiUtils';
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
  const position = (props.isThumbnail) ? props.sound.thumbnailPosition : props.sound.position;
  return isSoundInsideScreen(position, props.isThumbnail);
};

const isSoundStayingNotVisible = (currentProps, nextProps) =>
  (!isSoundVisible(currentProps) && !isSoundVisible(nextProps));

class MapCircleContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.isThumbnail) {
      return this.shouldThumbnailUpdate(nextProps);
    }
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

  shouldThumbnailUpdate(nextProps) {
    const currentPosition = this.props.sound.thumbnailPosition;
    const nextPosition = nextProps.sound.thumbnailPosition;
    // update only when receiving final points positions
    return Boolean(!currentPosition && nextPosition);
  }

  render() {
    if (!isSoundVisible(this.props)) {
      return null;
    }
    return (
      <MapCircle
        sound={this.props.sound}
        isSelected={this.props.isSelected}
        isThumbnail={this.props.isThumbnail}
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

MapCircleContainer.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  playAudio,
  stopAudio,
  selectSound,
  toggleHoveringSound,
})(MapCircleContainer);
