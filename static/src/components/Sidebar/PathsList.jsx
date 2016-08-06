import React from 'react';
import AudioTickListener from '../App/AudioTickListener';
import '../../stylesheets/PathsList.scss';
import { getRandomElement } from '../../utils/misc';
import { MESSAGE_STATUS } from '../../constants';
import { connect } from 'react-redux';
import { displaySystemMessage, setPathSync, addPath, startStopPath,
  setPathCurrentlyPlaying } from '../../actions';

const propTypes = {
  paths: React.PropTypes.array,
  sounds: React.PropTypes.array,
  startStopPlayingPath: React.PropTypes.func,
  updateSelectedSound: React.PropTypes.func,
  addPath: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
  setPathSync: React.PropTypes.func,
  startStopPath: React.PropTypes.func,
  setPathCurrentlyPlaying: React.PropTypes.func,
  playSoundByFreesoundId: React.PropTypes.func,
  audioContext: React.PropTypes.object,
};

class PathsList extends AudioTickListener {
  createNewPath() {
    if (this.props.sounds.length) {
      const pathSounds = [];
      const nSounds = 2 + Math.floor(Math.random() * 3);
      [...Array(nSounds).keys()].map(() => pathSounds.push(getRandomElement(this.props.sounds)));
      this.props.addPath(pathSounds);
    } else {
      this.props.displaySystemMessage('A new path can not be created until there are some sounds ' +
        'in the map', MESSAGE_STATUS.ERROR);
    }
  }

  onAudioTick(bar, beat, tick, time) {
    for (let i = 0; i < this.props.paths.length; i++) {
      if (this.props.paths[i].isPlaying) {
        if (this.props.paths[i].syncMode === 'beat') {
          if (tick % 4 === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(i, time);
              }
            }
          }
        }
        if (this.props.paths[i].syncMode === 'bar') {
          if (tick === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(i, time);
              }
            }
          }
        }
      }
    }
  }

  playNextSoundFromPath(pathIdx, time) {
    const path = this.props.paths[pathIdx];
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
      this.props.setPathCurrentlyPlaying(pathIdx, nextSoundToPlayIdx, willFinishAt);
      if (path.syncMode === 'no') {
        this.props.playSoundByFreesoundId(nextSoundToPlay.id, () => {
          this.playNextSoundFromPath(pathIdx);
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

  startStopPlayingPath(pathIdx) {
    if (this.props.paths[pathIdx].isPlaying) {
      this.props.startStopPath(pathIdx, false);
    } else {
      this.props.startStopPath(pathIdx, true);
      this.playNextSoundFromPath(pathIdx);
    }
  }

  setPathSyncMode(pathIdx, newMode) {
    this.props.setPathSync(pathIdx, newMode);
    const path = this.props.paths[pathIdx];
    if (newMode === 'no') {
      if (path.isPlaying) {
        if (path.currentlyPlaying.willFinishAt === undefined) {
          this.playNextSoundFromPath(pathIdx);
        } else {
          this.playNextSoundFromPath(pathIdx, path.currentlyPlaying.willFinishAt);
        }
      }
    }
  }

  render() {
    return (
      <ul className="paths-list">
        {this.props.paths.map((path, pathIdx) =>
          <li key={pathIdx}>
            <button onClick={() => this.startStopPlayingPath(pathIdx)} >
              {(path.isPlaying) ?
                <i className="fa fa-pause fa-lg" aria-hidden="true" /> :
                <i className="fa fa-play fa-lg" aria-hidden="true" />}
            </button> {path.name} ({path.sounds.length} sounds)&nbsp;
            <div className="button-group">
              <button
                className={(path.syncMode === 'no') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, 'no')}
              >x</button>
              <button
                className={(path.syncMode === 'beat') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, 'beat')}
              >&#9833;</button>
              <button
                className={(path.syncMode === 'bar') ? 'active' : ''}
                onClick={() => this.setPathSyncMode(pathIdx, 'bar')}
              >o</button>
            </div>
            {(path.isSelected) ?
              <ul className="sounds-list">
                {path.sounds.map((sound, soundIndex) => {
                  // Computed vars here
                  return (
                    <li
                      key={soundIndex}
                      onClick={() => this.props.updateSelectedSound(sound.id)}
                    >{sound.name}</li>
                  );
                })}
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
  const { paths } = state.paths;
  return { paths };
};

PathsList.propTypes = propTypes;
export default connect(mapStateToProps, {
  addPath, displaySystemMessage, setPathSync, startStopPath, setPathCurrentlyPlaying,
}, undefined, { withRef: true })(PathsList);
