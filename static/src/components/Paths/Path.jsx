import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Paths.scss';
import { setPathSync, startStopPath, setPathCurrentlyPlaying, selectPath,
  setPathWaitUntilFinished, setPathActive,
  playNextSoundFromPath } from '../../actions/paths';
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


class Path extends React.Component {
  onPathClick() {
    this.props.selectPath(this.props.path.id);
    if (!this.props.selected) {
      this.props.setPathActive(this.props.path.id, true);
    } else {
      this.props.setPathActive(this.props.path.id, !this.props.path.isActive);
    }
  }

  setPathSyncHelper(newSyncMode) {
    const prevSyncMode = this.props.path.syncMode;
    this.props.setPathSync(this.props.path.id, newSyncMode);
    if ((prevSyncMode !== 'no') && (newSyncMode === 'no')) {
      // Path changed from syncMode != 'no' to syncMode = 'no'
      if (this.props.path.isPlaying) {
        const time = (this.props.path.currentlyPlaying.willFinishAt === undefined) ?
          0 : this.props.path.currentlyPlaying.willFinishAt;
        this.props.playNextSoundFromPath(this.props.path.id, time);
      }
    }
  }

  startStopPlayingPath() {
    const path = this.props.path;
    if (path.isPlaying) {
      this.props.startStopPath(path.id, false);
    } else if (path.sounds.length) {
      this.props.startStopPath(path.id, true);
      if (path.syncMode === 'no') {
        // If path passed from stop to play and syncMode is no, trigger play next sound
        this.props.playNextSoundFromPath(path.id, 0);
      }
    }
  }

  render() {
    const path = this.props.path;
    return (
      <li className={(this.props.selected) ? 'selected' : ''}>
        <div className="path-controls">
          <button onClick={() => this.startStopPlayingPath()} >
            <i className={`fa fa-${(path.isPlaying) ? 'pause' : 'play'} fa-lg`} aria-hidden />
          </button>
          <a className="cursor-pointer" onClick={() => this.onPathClick()} >
            {path.name} ({path.sounds.length} sounds)
          </a>&nbsp;
          <div className="button-group">
            <button
              className={(path.syncMode === 'no') ? 'active' : ''}
              onClick={() => this.setPathSyncHelper('no')}
            >x</button>
            <button
              className={(path.syncMode === 'beat') ? 'active' : ''}
              onClick={() => this.setPathSyncHelper('beat')}
            >1/4</button>
            <button
              className={(path.syncMode === '2xbeat') ? 'active' : ''}
              onClick={() => this.setPathSyncHelper('2xbeat')}
            >1/2</button>
            <button
              className={(path.syncMode === 'bar') ? 'active' : ''}
              onClick={() => this.setPathSyncHelper('bar')}
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
            {path.sounds.map((soundID, soundIdx) => (
              <PathListSound
                key={soundIdx}
                soundID={soundID}
                pathID={path.id}
              />
          ))}
          </ul> : ''}
      </li>
    );
  }
}

const mapStateToProps = () => ({});

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
