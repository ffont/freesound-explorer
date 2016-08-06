import React from 'react';
import '../../stylesheets/PathsList.scss';
import { getRandomElement } from '../../utils/misc';
import { MESSAGE_STATUS } from '../../constants';
import { connect } from 'react-redux';
import { displaySystemMessage, setPathSync, addPath } from '../../actions';

const propTypes = {
  paths: React.PropTypes.array,
  sounds: React.PropTypes.array,
  startStopPlayingPath: React.PropTypes.func,
  updateSelectedSound: React.PropTypes.func,
  addPath: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
  setPathSync: React.PropTypes.func,
};

class PathsList extends React.Component {
  createNewPath() {
    if (this.props.sounds.length) {
      const pathSounds = [];
      const nSounds = 2 + Math.floor(Math.random() * 3);
      [...Array(nSounds).keys()].map(() => pathSounds.push(getRandomElement(this.props.sounds)));
      this.props.addPath(pathSounds);
      // TODO: force update draw map?
    } else {
      this.props.displaySystemMessage('A new path can not be created until there are some sounds ' +
        'in the map', MESSAGE_STATUS.ERROR);
    }
  }

  render() {
    return (
      <ul className="paths-list">
        {this.props.paths.map((path, pathIndex) =>
          <li key={pathIndex}>
            <button onClick={() => this.props.startStopPlayingPath(pathIndex)} >
              {(path.isPlaying) ?
                <i className="fa fa-pause fa-lg" aria-hidden="true" /> :
                <i className="fa fa-play fa-lg" aria-hidden="true" />}
            </button> {path.name} ({path.sounds.length} sounds)&nbsp;
            <div className="button-group">
              <button
                className={(path.syncMode === 'no') ? 'active' : ''}
                onClick={() => this.props.setPathSync(pathIndex, 'no')}
              >x</button>
              <button
                className={(path.syncMode === 'beat') ? 'active' : ''}
                onClick={() => this.props.setPathSync(pathIndex, 'beat')}
              >&#9833;</button>
              <button
                className={(path.syncMode === 'bar') ? 'active' : ''}
                onClick={() => this.props.setPathSync(pathIndex, 'bar')}
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
  addPath, displaySystemMessage, setPathSync,
}, undefined, { withRef: true })(PathsList);
