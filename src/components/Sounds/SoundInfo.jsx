import React from 'react';
import PropTypes from 'prop-types';
import { midiNoteNumberToMidiNoteLabel } from 'containers/Midi/utils';
import './SoundInfo.scss';
import Waveform from '../Waveform';
import { downloadSound } from '../../containers/SoundInfo/actions';

const propTypes = {
  isVisible: PropTypes.bool,
  isMidiSupported: PropTypes.bool,
  sound: PropTypes.object,
  position: PropTypes.object,
  direction: PropTypes.string,
  isUserLoggedIn: PropTypes.bool,
  setSoundCurrentlyLearnt: PropTypes.func,
  soundCurrentlyLearnt: PropTypes.string,
  notesMapped: PropTypes.object,
  selectedPath: PropTypes.string,
  addSoundToPath: PropTypes.func,
  bookmarkSound: PropTypes.func,
  downloadSound: PropTypes.func,
};

const DEFAULT_CLASSNAME = 'sound-info-modal';

class SoundInfo extends React.Component {
  getClassName() {
    if (!this.props.isVisible) {
      return DEFAULT_CLASSNAME;
    }
    let className = `${DEFAULT_CLASSNAME} active`;
    if (this.props.direction === 'down') {
      className += '-down';
    }
    return className;
  }

  getPosition() {
    const style = {
      top: this.props.position.top,
      left: this.props.position.left,
    };
    return style;
  }

  getCurrentlyAssignedMidiNoteLabel() {
    return Object.keys(this.props.notesMapped).reduce((curNoteLabel, curNote) => {
      if (this.props.notesMapped[curNote] === this.props.sound.id) {
        return midiNoteNumberToMidiNoteLabel(curNote);
      }
      return curNoteLabel;
    }, '');
  }

  getFreesoundButtons() {
    let bookmarkSoundIcon = null;
    let downloadSoundIcon = null;
    if (this.props.isUserLoggedIn) {
      bookmarkSoundIcon = (this.props.sound.isBookmarked) ? (
        <button>
          <i className="fa fa-star fa-lg" aria-hidden />
        </button>
      ) : (
        <button onClick={() => this.props.bookmarkSound(this.props.sound)}>
          <i className="fa fa-star-o fa-lg" aria-hidden />
        </button>
      );
      downloadSoundIcon = (
        <button>
          <a rel="noopener noreferrer" href={`${this.props.sound.url}download/`} >
            <i className="fa fa-download fa-lg" aria-hidden="true" />
          </a>
        </button>
      );
    }
    return { bookmarkSoundIcon, downloadSoundIcon };
  }

  getMidiLearnButton() {
    return (
      <button
        className={(this.props.soundCurrentlyLearnt === this.props.sound.id) ? 'learning' : ''}
        onClick={() => this.props.setSoundCurrentlyLearnt(this.props.sound.id)}
      >
        MIDI: {(this.props.soundCurrentlyLearnt === this.props.sound.id) ? 'learning' :
          this.getCurrentlyAssignedMidiNoteLabel()}
      </button>
    );
  }

  getAddToPathButton() {
    return (this.props.selectedPath) ? (
      <button
        onClick={() => this.props.addSoundToPath(
          this.props.sound.id, this.props.selectedPath)}
      >Add to path</button>
    ) : null;
  }

  getUserButtons() {
    const { bookmarkSoundIcon, downloadSoundIcon } = this.getFreesoundButtons();
    const midiLearnButton = (this.props.isMidiSupported) ? this.getMidiLearnButton() : null;
    const addToPathButton = this.getAddToPathButton();
    return (
      <div className="sound-info-buttons-container">
        {addToPathButton}
        {midiLearnButton}
        {bookmarkSoundIcon}
        {downloadSoundIcon}
      </div>
    );
  }

  getLicenseLabel() {
    switch (this.props.sound.license) {
      case 'http://creativecommons.org/publicdomain/zero/1.0/':
        return 'CC0';
      case 'http://creativecommons.org/licenses/by/3.0/':
        return 'CC-BY';
      case 'http://creativecommons.org/licenses/by-nc/3.0/':
        return 'CC-BY-NC';
      case 'http://creativecommons.org/licenses/sampling+/1.0/':
        return 'S+';
      default:
        return '-';
    }
  }

  render() {
    const userButtons = this.getUserButtons();
    return (
      <div className={this.getClassName()} style={this.getPosition()}>
        <a href={this.props.sound.url} target="_blank" rel="noopener noreferrer">
          <div className="sound-info-modal-title">
            <div>{this.props.sound.name}</div>
            <div>by {this.props.sound.username} ({this.getLicenseLabel()})</div>
          </div>
        </a>
        <div className="sound-info-modal-content">
          <Waveform sound={this.props.sound} />
          {userButtons}
        </div>
      </div>
    );
  }
}

SoundInfo.propTypes = propTypes;
export default SoundInfo;
