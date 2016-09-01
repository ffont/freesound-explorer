import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/PathList.scss';
import { getRandomElement } from '../../utils/misc';
import { MESSAGE_STATUS } from '../../constants';
import { addPath } from '../../actions/paths';
import { displaySystemMessage } from '../../actions/messagesBox';
import Path from './Path';

const propTypes = {
  paths: React.PropTypes.array,
  selectedPath: React.PropTypes.string,
  spaces: React.PropTypes.array,
  currentSpace: React.PropTypes.string,
  addPath: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
};

class PathList extends React.Component {

  createNewPath() {
    if (this.props.currentSpace !== undefined) {
      const pathSounds = [];
      const nSounds = 2 + Math.floor(Math.random() * 3);
      const spaceSounds = this.props.spaces[0].sounds;
      [...Array(nSounds).keys()].map(() => pathSounds.push(getRandomElement(spaceSounds)));
      this.props.addPath(pathSounds);
    } else {
      this.props.displaySystemMessage('New paths can not be created if there is no selected ' +
        'space', MESSAGE_STATUS.ERROR);
    }
  }

  render() {
    return (
      <ul className="paths-list">
        {this.props.paths.map((path) =>
          <Path key={path.id} path={path} selected={path.id === this.props.selectedPath} />
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
  const { spaces, currentSpace } = state.spaces;
  return { paths, selectedPath, spaces, currentSpace };
};

PathList.propTypes = propTypes;
export default connect(mapStateToProps, {
  addPath, displaySystemMessage,
})(PathList);
