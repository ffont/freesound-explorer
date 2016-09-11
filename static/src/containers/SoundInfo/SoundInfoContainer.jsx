import React from 'react';
import { connect } from 'react-redux';
import SoundInfo from '../../components/Sounds/SoundInfo';
import { addSoundToPath } from '../Paths/actions';
import { displaySystemMessage } from '../MessagesBox/actions';
import { setSoundCurrentlyLearnt } from '../Midi/actions';
import { bookmarkSound, downloadSound } from './actions';

const propTypes = {
  isVisible: React.PropTypes.bool,
  soundID: React.PropTypes.string,
  sound: React.PropTypes.object,
  position: React.PropTypes.object,
  direction: React.PropTypes.string,
  isUserLoggedIn: React.PropTypes.bool,
  setSoundCurrentlyLearnt: React.PropTypes.func,
  soundCurrentlyLearnt: React.PropTypes.string,
  notesMapped: React.PropTypes.object,
  selectedPath: React.PropTypes.string,
  addSoundToPath: React.PropTypes.func,
  downloadSound: React.PropTypes.func,
  bookmarkSound: React.PropTypes.func,
};

// TODO: SoundInfo component must read isUserLoggedIn from state.login (redux)

const SoundInfoContainer = (props) => (
  <SoundInfo {...props} />
);

const mapStateToProps = (state) => {
  const { notesMapped, soundCurrentlyLearnt } = state.midi;
  const { selectedPath } = state.paths;
  const sound = state.sounds.byID && state.sounds.byID[state.soundInfoModal.soundID];
  return Object.assign({}, state.soundInfoModal,
    { sound, selectedPath, notesMapped, soundCurrentlyLearnt });
};

SoundInfoContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  bookmarkSound,
  downloadSound,
  displaySystemMessage,
  addSoundToPath,
  setSoundCurrentlyLearnt,
})(SoundInfoContainer);
