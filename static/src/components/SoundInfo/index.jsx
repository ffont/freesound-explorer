import React from 'react';
import { connect } from 'react-redux';
import freesound from '../../vendors/freesound';
import '../../stylesheets/SoundInfo.scss';
import Waveform from './Waveform';
import { MESSAGE_STATUS } from '../../constants';
import sassVariables from 'json!../../stylesheets/variables.json';
import { displaySystemMessage, addSoundToPath } from '../../actions';

const propTypes = {
  position: React.PropTypes.object,
  sound: React.PropTypes.object,
  isUserLoggedIn: React.PropTypes.bool,
  displaySystemMessage: React.PropTypes.func,
  setIsMidiLearningSoundId: React.PropTypes.func,
  isMidiLearningSoundId: React.PropTypes.number,
  midiMappings: React.PropTypes.object,
  selectedPath: React.PropTypes.string,
  addSoundToPath: React.PropTypes.func,
  loadSoundByFreesoundId: React.PropTypes.func,
};

// TODO: SoundInfo component must read isUserLoggedIn from state.login (redux)

const DEFAULT_CLASSNAME = 'sound-info-modal';

class SoundInfo extends React.Component {
  constructor(props) {
    super(props);
    this.lastTopPosition = 0;
    this.lastLeftPosition = 0;
    this.lastSound = undefined;
  }

  getCurrentlyAssignedMidiNoteLabel() {
    // let correspondingKey = '-';
    let octave = '';
    let noteLabel = '';
    Object.keys(this.props.midiMappings.notes).forEach((key) => {
      if (this.props.midiMappings.notes[key] === this.lastSound.id) {
        octave = parseInt(Math.floor(key / 12) - 1, 10);
        noteLabel = 'C C#D D#E F F#G G#A A#B '.substring((key % 12) * 2, ((key % 12) * 2) + 2);
        if (noteLabel[1] === ' ') { noteLabel = noteLabel[0]; }
        // correspondingKey = parseInt(key, 10);
      }
    });
    return `${noteLabel}${octave}`; // (${correspondingKey})`;
  }

  getClassName() {
    if (!this.props.position) {
      // hide modal: reset classname to default (not visible)
      return DEFAULT_CLASSNAME;
    }
    let className = `${DEFAULT_CLASSNAME} active`;
    if (this.props.position.y < parseInt(sassVariables.soundInfoModalHeight, 10)) {
      className += '-down';
    }
    return className;
  }

  getContainerStyle() {
    if (!!this.props.position) {
      this.lastTopPosition = this.props.position.y;
      this.lastLeftPosition = this.props.position.x;
    }
    return { top: this.lastTopPosition, left: this.lastLeftPosition };
  }

  updateSoundContent() {
    if (!!this.props.sound) {
      this.lastSound = this.props.sound;
      this.bookmarkSound = this.bookmarkSound.bind(this);
      this.downloadSound = this.downloadSound.bind(this);
    }
  }

  bookmarkSound() {
    freesound.setToken(sessionStorage.getItem('access_token'), 'oauth');
    const sound = this.lastSound;
    sound.bookmark(
      sound.name,  // Use sound name
      'Freesound Explorer' // Category
    ).then(() => {
      this.lastSound.isBookmarked = true;
      this.props.displaySystemMessage('Sound bookmarked!', MESSAGE_STATUS.SUCCESS);
    },
    () => this.props.displaySystemMessage('Error bookmarking sound', MESSAGE_STATUS.ERROR));
  }

  downloadSound() {
    this.props.displaySystemMessage('Downloading sounds is not implemented yet',
      MESSAGE_STATUS.INFO);
  }

  render() {
    const className = this.getClassName();
    const containerStyle = this.getContainerStyle();
    this.updateSoundContent();
    if (!this.lastSound) {
      return null;
    }
    let bookmarkSoundIcon = null;
    let dowloadSoundIcon = null;
    if (this.props.isUserLoggedIn) {
      bookmarkSoundIcon = (this.lastSound.isBookmarked) ? (
        <button>
          <i className="fa fa-star fa-lg" aria-hidden />
        </button>
      ) : (
        <button onClick={this.bookmarkSound}>
          <i className="fa fa-star-o fa-lg" aria-hidden />
        </button>
      );
      dowloadSoundIcon = (
        <button onClick={this.downloadSound}>
          <i className="fa fa-download fa-lg" aria-hidden="true" />
        </button>
      );
    }
    const midiLearnButton = (
      <button
        className={(this.props.isMidiLearningSoundId === this.lastSound.id) ? 'learning' : ''}
        onClick={() => this.props.setIsMidiLearningSoundId(this.lastSound.id)}
      >
        MIDI: {(this.props.isMidiLearningSoundId === this.lastSound.id) ? 'learning' :
          this.getCurrentlyAssignedMidiNoteLabel()}
      </button>
    );
    let addToPathButton = null;
    if (this.props.selectedPath !== undefined) {
      addToPathButton = (
        <button
          onClick={() => this.props.addSoundToPath(
            this.props.sound, this.props.selectedPath)}
        >Add to path</button>
      );
    }
    const userButtons = (
      <div className="sound-info-buttons-container">
        {addToPathButton}
        {midiLearnButton}
        {bookmarkSoundIcon}
        {dowloadSoundIcon}
      </div>
    );
    return (
      <div className={className} style={containerStyle}>
        <div>
          <a href={this.lastSound.url}>
            <div className="sound-info-modal-title">
              <div>{this.lastSound.name}</div>
              <div>by {this.lastSound.username}</div>
            </div>
          </a>
          <div className="sound-info-modal-content">
            <Waveform
              sound={this.props.sound}
              loadSoundByFreesoundId={this.props.loadSoundByFreesoundId}
            />
            {userButtons}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedPath } = state.paths;
  return { selectedPath };
};

SoundInfo.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage, addSoundToPath,
})(SoundInfo);
