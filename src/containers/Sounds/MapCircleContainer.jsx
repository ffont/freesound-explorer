import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MapCircle from 'components/Sounds/MapCircle';
import { playAudio, stopAudio } from '../Audio/actions';
import { selectSound, deselectSound, deselectAllSounds, toggleHoveringSound }
  from './actions';
import { openModalForSound, hideModal } from '../SoundInfo/actions';
import { isSoundInsideScreen } from './utils';
import { makeIsSoundSelected } from './selectors';

const propTypes = {
  sound: PropTypes.object,
  isThumbnail: PropTypes.bool,
  shouldPlayOnHover: PropTypes.bool,
  isSelected: PropTypes.bool,
  playAudio: PropTypes.func,
  stopAudio: PropTypes.func,
  selectSound: PropTypes.func,
  deselectSound: PropTypes.func,
  deselectAllSounds: PropTypes.func,
  toggleHoveringSound: PropTypes.func,
  openModalForSound: PropTypes.func,
  hideModal: PropTypes.func,
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
    if (this.props.shouldPlayOnHover) {
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
      this.props.hideModal();
      this.props.deselectSound();
    } else {
      this.props.deselectAllSounds();
      this.props.openModalForSound(this.props.sound);
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
  const isSoundSelected = makeIsSoundSelected(soundID);
  return (state) => {
    const sound = state.sounds.byID[soundID];
    const { shouldPlayOnHover } = state.settings;
    const isSelected = isSoundSelected(state);
    return {
      sound,
      isThumbnail,
      shouldPlayOnHover,
      isSelected,
    };
  };
};

MapCircleContainer.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  playAudio,
  stopAudio,
  selectSound,
  deselectSound,
  deselectAllSounds,
  toggleHoveringSound,
  openModalForSound,
  hideModal,
})(MapCircleContainer);
