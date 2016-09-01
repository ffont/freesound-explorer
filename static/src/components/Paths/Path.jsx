import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Paths.scss';
import AudioTickListener from '../App/AudioTickListener';
import { setPathSync, startStopPath, setPathCurrentlyPlaying, selectPath,
  setPathWaitUntilFinished, setPathActive, playNextSoundFromPath } from '../../actions/paths';
import PathListSound from './PathListSound';


const propTypes = {
  path: React.PropTypes.object,
  selected: React.PropTypes.bool,
  startStopPlayingPath: React.PropTypes.func,
  selectSound: React.PropTypes.func,
  setPathSync: React.PropTypes.func,
  startStopPath: React.PropTypes.func,
  setPathCurrentlyPlaying: React.PropTypes.func,
  setPathWaitUntilFinished: React.PropTypes.func,
  setPathActive: React.PropTypes.func,
  selectPath: React.PropTypes.func,
  deleteSoundFromPath: React.PropTypes.func,
  playAudio: React.PropTypes.func,
  stopAudio: React.PropTypes.func,
  playNextSoundFromPath: React.PropTypes.func,
};

class Path extends AudioTickListener {

  componentDidUpdate(prevProps) {
    // Look for state changes we are interested in monitoring and trigger corresponding methods
    // if needed (i.e. to triger component methods after redux actions have been completed).
    const newPath = this.props.path;
    const prevPath = prevProps.path;
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
      this.props.playNextSoundFromPath(newPath.id, shouldPlayNextSoundAtTime);
    }
  }

  triggerSoundHelper(path, time) {
    if (path.waitUntilFinished) {
      // Check if sound will be finished at time
      if ((path.currentlyPlaying.willFinishAt === undefined)
        || (path.currentlyPlaying.willFinishAt <= time)) {
        this.props.playNextSoundFromPath(path.id, time);
      }
    } else {
      this.props.playNextSoundFromPath(path.id, time);
    }
  }

  onAudioTick(bar, beat, tick, time) {
    // Iterate over all paths and check if some should trigger next sound
    const path = this.props.path;
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

  startStopPlayingPath() {
    const path = this.props.path;
    if (path.isPlaying) {
      this.props.startStopPath(path.id, false);
    } else if (path.sounds.length) {
      this.props.startStopPath(path.id, true);
    }
  }

  onPathClick() {
    this.props.selectPath(this.props.path.id);
    if (!this.props.selected) {
      this.props.setPathActive(this.props.path.id, true);
    } else {
      this.props.setPathActive(this.props.path.id, !this.props.path.isActive);
    }
  }

  render() {
    const path = this.props.path;
    return (
      <li className={(this.props.selected) ? 'selected' : ''}>
        <div className="path-controls">
          <button onClick={() => this.startStopPlayingPath()} >
            {(path.isPlaying) ?
              <i className="fa fa-pause fa-lg" aria-hidden="true" /> :
              <i className="fa fa-play fa-lg" aria-hidden="true" />}
          </button>
          <a className="cursor-pointer" onClick={() => this.onPathClick()} >
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
        </div>
        {((path.isActive) && (path.sounds.length === 0)) ?
          <ul className="sounds-list"><li>Select a sound and click 'Add to path'</li></ul>
            : false
        }
        {(path.isActive) ?
          <ul className="sounds-list">
            {path.sounds.map((soundId, soundPathIndex) => {
              return (
                <PathListSound
                  key={soundId}
                  soundId={soundId}
                  soundPathIndex={soundPathIndex}
                  pathId={path.id}
                />
              );
            })
            }
          </ul> : ''}
      </li>
    );
  }
}

const mapStateToProps = (state) => ({});

Path.propTypes = propTypes;
export default connect(mapStateToProps, {
  setPathSync,
  startStopPath,
  setPathCurrentlyPlaying,
  selectPath,
  setPathWaitUntilFinished,
  setPathActive,
  playNextSoundFromPath,
})(Path);
