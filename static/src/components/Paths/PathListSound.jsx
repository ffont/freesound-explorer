import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Paths.scss';
import { truncatedString } from '../../utils/misc';
import { deleteSoundFromPath } from '../../actions/paths';
import { selectSound } from '../../actions/sounds';

const propTypes = {
  soundID: React.PropTypes.string,
  pathID: React.PropTypes.string,
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
          onClick={() => this.props.selectSound(this.props.soundID)}
        >{truncatedString(this.props.sound.name, 25)}</a>
        <a
          onClick={() => this.props.deleteSoundFromPath(this.props.soundID,
          this.props.pathID)}
        > &nbsp;<i className="fa fa-trash-o fa-lg" aria-hidden="true" /> </a>
      </li>
    );
  }
}

const makeMapStateToProps = (_, ownProps) => {
  const { soundID } = ownProps;
  return (state) => {
    const sound = state.sounds.byID[soundID];
    return {
      sound,
    };
  };
};

PathListSound.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  deleteSoundFromPath, selectSound,
})(PathListSound);
