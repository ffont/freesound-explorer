import React from 'react';
import { connect } from 'react-redux';
import { truncatedString } from '../../utils/misc';
import { deleteSoundFromPath } from '../../actions/paths';
import { selectSound } from '../../actions/sounds';

const propTypes = {
  soundId: React.PropTypes.string,
  pathId: React.PropTypes.string,
  soundPathIndex: React.PropTypes.number,
  sound: React.PropTypes.object,
  selectSound: React.PropTypes.func,
  deleteSoundFromPath: React.PropTypes.func,
};

class PathListSound extends React.Component {
  render() {
    return (
      <li>
        <a
          className="cursor-pointer"
          onClick={() => this.props.selectSound(this.props.soundId)}
        >{truncatedString(this.props.sound.name, 10)}</a>
        <a
          onClick={() => this.props.deleteSoundFromPath(this.props.soundPathIndex,
          this.props.pathId)}
        > &nbsp;<i className="fa fa-trash-o fa-lg" aria-hidden="true" /> </a>
      </li>
    );
  }
}

const makeMapStateToProps = (_, ownProps) => {
  const { soundId } = ownProps;
  return (state) => {
    const sound = state.sounds.byID[soundId];
    return {
      sound,
    };
  };
};

PathListSound.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  deleteSoundFromPath, selectSound,
})(PathListSound);
