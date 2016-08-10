import React from 'react';
import { connect } from 'react-redux';
import AudioTickListener from '../App/AudioTickListener';
import '../../stylesheets/PathsList.scss';
import { getRandomElement, truncatedString } from '../../utils/misc';
import { elementWithId } from '../../utils/arrayUtils';
import { MESSAGE_STATUS } from '../../constants';
import { setPathSync, addPath, startStopPath,
  setPathCurrentlyPlaying, selectPath, deleteSoundFromPath,
  setPathWaitUntilFinished } from '../../actions';
import { displaySystemMessage } from '../../actions/messagesBox';

const propTypes = {
  paths: React.PropTypes.array,
  selectedPath: React.PropTypes.string,
  sounds: React.PropTypes.array,
  startStopPlayingPath: React.PropTypes.func,
  updateSelectedSound: React.PropTypes.func,
  addPath: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
  setPathSync: React.PropTypes.func,
  startStopPath: React.PropTypes.func,
  setPathCurrentlyPlaying: React.PropTypes.func,
  setPathWaitUntilFinished: React.PropTypes.func,
  selectPath: React.PropTypes.func,
  deleteSoundFromPath: React.PropTypes.func,
  playSoundByFreesoundId: React.PropTypes.func,
  audioContext: React.PropTypes.object,
};

class PathsList extends AudioTickListener {

  componentDidUpdate(prevProps) {
    // Look for state changes we are interested in monitoring and trigger corresponding methods
    // if needed (i.e. to triger component methods after redux actions have been completed).
    for (let i = 0; i < this.props.paths.length; i++) {
      const newPath = this.props.paths[i];
      const prevPath = prevProps.paths[i];
      let shouldPlayNextSound = false;
      let shouldPlayNextSoundAtTime = 0;
      if ((newPath.isPlaying) && (!prevPath.isPlaying) && (newPath.syncMode === 'no')) {
        // A path changed form isPlaying = false to isPlaying = true and syncMode is 'no'
        shouldPlayNextSound = true;
      }
      if ((newPath.syncMode === 'no') && (prevPath.syncMode !== 'no')) {
        // A path changed from syncMode != 'no' to syncMode = 'no'
        if (newPath.isPlaying) {
          shouldPlayNextSoundAtTime = (newPath.currentlyPlaying.willFinishAt === undefined) ?
            0 : newPath.currentlyPlaying.willFinishAt;
          shouldPlayNextSound = true;
        }
      }
      if (shouldPlayNextSound) {
        this.playNextSoundFromPath(newPath.id, shouldPlayNextSoundAtTime);
      }
    }
  }

  createNewPath() {
    if (this.props.sounds.length) {
      const pathSounds = [];
      const nSounds = 2 + Math.floor(Math.random() * 3);
      [...Array(nSounds).keys()].map(() => pathSounds.push(getRandomElement(this.props.sounds)));
      this.props.addPath(pathSounds);
    } else {
      this.props.displaySystemMessage('New paths can not be created until there are some sounds ' +
        'in the map', MESSAGE_STATUS.ERROR);
    }
  }

  triggerSoundHelper(path, time) {
    if (path.waitUntilFinished) {
      // Check if sound will be finished at time
      if ((path.currentlyPlaying.willFinishAt === undefined)
        || (path.currentlyPlaying.willFinishAt <= time)) {
        this.playNextSoundFromPath(path.id, time);
      }
    } else {
      this.playNextSoundFromPath(path.id, time);
    }
  }

  onAudioTick(bar, beat, tick, time) {
    // Iterate over all paths and check if some should trigger next sound
    for (let i = 0; i < this.props.paths.length; i++) {
      const path = this.props.paths[i];
      if (path.isPlaying) {
        if (path.syncMode === 'beat') {
          if (tick % 4 === 0) {
            this.triggerSoundHelper(path, time);
          }
        }
        if (path.syncMode === '2xbeat') {
          if (tick % 8 === 0) {
            this.triggerSoundHelper(path, time);
          }
        }
        if (path.syncMode === 'bar') {
          if (tick === 0) {
            this.triggerSoundHelper(path, time);
          }
        }
      }
    }
  }

  playNextSoundFromPath(pathId, time) {
    const path = elementWithId(this.props.paths, pathId);
    if (path) {
      if (path.isPlaying) {
        let nextSoundToPlayIdx;
        if ((path.currentlyPlaying.soundIdx === undefined) ||
          (path.currentlyPlaying.soundIdx + 1 >= path.sounds.length)) {
          nextSoundToPlayIdx = 0;
        } else {
          nextSoundToPlayIdx = path.currentlyPlaying.soundIdx + 1;
        }
        const nextSoundToPlay = path.sounds[nextSoundToPlayIdx];
        const willFinishAt = (time === undefined) ?
          this.props.audioContext.currentTime + nextSoundToPlay.duration :
          time + nextSoundToPlay.duration;
        this.props.setPathCurrentlyPlaying(path.id, nextSoundToPlayIdx, willFinishAt);
        if (path.syncMode === 'no') {
          this.props.playSoundByFreesoundId(nextSoundToPlay.id, () => {
            this.playNextSoundFromPath(path.id);
          });
        } else {
          // If synched to metronome, sounds will be triggered by onAudioTick events
          if (time !== undefined) {
            this.props.playSoundByFreesoundId(
              path.sounds[nextSoundToPlayIdx].id, undefined, undefined, undefined, time);
          }
        }
      }
    }
  }

  startStopPlayingPath(pathId) {
    const path = elementWithId(this.props.paths, pathId);
    if (path.isPlaying) {
      this.props.startStopPath(path.id, false);
    } else {
      if (path.sounds.length) {
        this.props.startStopPath(path.id, true);
      }
    }
  }

  render() {
    return (
      <ul className="paths-list">
        {this.props.paths.map((path) =>
          <li key={path.id}>
            <button onClick={() => this.startStopPlayingPath(path.id)} >
              {(path.isPlaying) ?
                <i className="fa fa-pause fa-lg" aria-hidden="true" /> :
                <i className="fa fa-play fa-lg" aria-hidden="true" />}
            </button>
            <a className="cursor-pointer" onClick={() => this.props.selectPath(path.id)} >
              {path.name} ({path.sounds.length} sounds)
            </a>&nbsp;
            <div className="button-group">
              <button
                className={(path.syncMode === 'no') ? 'active' : ''}
                onClick={() => this.props.setPathSync(path.id, 'no')}
              >x</button>
              <button
                className={(path.syncMode === 'beat') ? 'active' : ''}
                onClick={() => this.props.setPathSync(path.id, 'beat')}
              >1/4</button>
              <button
                className={(path.syncMode === '2xbeat') ? 'active' : ''}
                onClick={() => this.props.setPathSync(path.id, '2xbeat')}
              >1/2</button>
              <button
                className={(path.syncMode === 'bar') ? 'active' : ''}
                onClick={() => this.props.setPathSync(path.id, 'bar')}
              >1</button>
            </div>
            <div className="button-group">
              <button
                className={(path.waitUntilFinished === false) ? 'active' : ''}
                onClick={() => this.props.setPathWaitUntilFinished(path.id, !path.waitUntilFinished)}
              >></button>
            </div>
            {((path.id === this.props.selectedPath) && (path.sounds.length === 0)) ?
              <ul className="sounds-list"><li>Select a sound and click 'Add to path'</li></ul>
                : false
            }
            {(path.id === this.props.selectedPath) ?
              <ul className="sounds-list">
                {path.sounds.map((sound, soundIndex) => (
                  <li key={soundIndex}>
                    <a
                      className="cursor-pointer"
                      onClick={() => this.props.updateSelectedSound(sound.id)}
                    >{truncatedString(sound.name, 40)}</a>
                    <a onClick={() => this.props.deleteSoundFromPath(soundIndex, path.id)} >
                      &nbsp;<i className="fa fa-trash-o fa-lg" aria-hidden="true" />
                    </a>
                  </li>))}
              </ul> : ''}
          </li>
        )}
        <li>
          <button onClick={() => this.createNewPath()} >
            <i className="fa fa-plus fa-lg" aria-hidden="true" />
          </button>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  const { paths, selectedPath } = state.paths;
  return { paths, selectedPath };
};

PathsList.propTypes = propTypes;
export default connect(mapStateToProps, {
  addPath, displaySystemMessage, setPathSync, startStopPath, setPathCurrentlyPlaying,
  selectPath, deleteSoundFromPath, setPathWaitUntilFinished,
}, undefined, { withRef: true })(PathsList);
