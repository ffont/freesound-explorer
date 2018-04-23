import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SoundInfo from 'components/Sounds/SoundInfo';
import { addSoundToPath } from '../Paths/actions';
import { displaySystemMessage } from '../MessagesBox/actions';
import { setSoundCurrentlyLearnt } from '../Midi/actions';
import { bookmarkSound, downloadSound } from './actions';

const propTypes = {
  isVisible: PropTypes.bool,
  isMidiSupported: PropTypes.bool,
  soundID: PropTypes.string,
  sound: PropTypes.object,
  position: PropTypes.object,
  direction: PropTypes.string,
  isUserLoggedIn: PropTypes.bool,
  setSoundCurrentlyLearnt: PropTypes.func,
  soundCurrentlyLearnt: PropTypes.string,
  notesMapped: PropTypes.object,
  selectedPath: PropTypes.string,
  addSoundToPath: PropTypes.func,
  downloadSound: PropTypes.func,
  bookmarkSound: PropTypes.func,
};

const SoundInfoContainer = (props) => {
  if (props.sound) {
    return <SoundInfo {...props} />;
  }
  return null;
};

const mapStateToProps = (state) => {
  const { notesMapped, soundCurrentlyLearnt, isMidiSupported } = state.midi;
  const { selectedPath } = state.paths;
  const { isUserLoggedIn } = state.login;
  const sound = state.sounds.byID && state.sounds.byID[state.sounds.soundInfoModal.soundID];
  return Object.assign({}, state.sounds.soundInfoModal,
    { sound, selectedPath, notesMapped, soundCurrentlyLearnt, isMidiSupported, isUserLoggedIn });
};

SoundInfoContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  bookmarkSound,
  downloadSound,
  displaySystemMessage,
  addSoundToPath,
  setSoundCurrentlyLearnt,
})(SoundInfoContainer);
