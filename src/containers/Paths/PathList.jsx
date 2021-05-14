import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRandomElement, elementWithId } from 'utils/arrayUtils';
import { MESSAGE_STATUS } from 'constants';
import { addPath } from './actions';
import { displaySystemMessage } from '../MessagesBox/actions';
import PathManager from './PathManager';

const propTypes = {
  paths: PropTypes.array,
  selectedPath: PropTypes.string,
  spaces: PropTypes.array,
  currentSpace: PropTypes.string,
  addPath: PropTypes.func,
  displaySystemMessage: PropTypes.func,
};

class PathList extends Component {

  createNewPath() {
    if (this.props.currentSpace) {
      const pathSounds = [];
      // const nSounds = 3 + Math.floor(Math.random() * 3);
      const nSounds = 0; // TODO: rethink whether we provide sounds by default
      const space = elementWithId(this.props.spaces, this.props.currentSpace, 'queryID');
      const spaceSounds = space.sounds;
      [...Array(nSounds).keys()].map(() => pathSounds.push(getRandomElement(spaceSounds)));
      this.props.addPath(pathSounds);
    } else {
      this.props.displaySystemMessage('New paths can not be created if there is no selected ' +
        'space', MESSAGE_STATUS.ERROR);
    }
  }

  render() {
    return (
      <ul className="PathList">
        {this.props.paths.map(path =>
          <PathManager key={path.id} path={path} selected={path.id === this.props.selectedPath} />
        )}
        <li className="add-new-path">
          <button onClick={() => this.createNewPath()} >
            <i className="fa fa-plus fa-lg" aria-hidden />New path
          </button>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  const { paths, selectedPath } = state.paths;
  const { spaces, currentSpace } = state.spaces;
  return { paths, selectedPath, spaces, currentSpace };
};

PathList.propTypes = propTypes;
export default connect(mapStateToProps, {
  addPath,
  displaySystemMessage,
})(PathList);
