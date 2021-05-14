import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { truncateString } from 'utils/stringUtils';
import { deleteSoundFromPath } from './actions';
import { selectSound } from '../Sounds/actions';

const propTypes = {
  soundIdx: PropTypes.number,
  soundID: PropTypes.string,
  pathID: PropTypes.string,
  sound: PropTypes.object,
  selectSound: PropTypes.func,
  deleteSoundFromPath: PropTypes.func,
};

class PathListSound extends Component {
  render() {
    return (
      <li className={(this.props.sound.isPlaying) ? 'playing' : ''}>
        <a
          className="cursor-pointer"
          onClick={() => this.props.selectSound(this.props.soundID)}
        >{truncateString(this.props.sound.name, 25)}</a>
        <a
          onClick={() => this.props.deleteSoundFromPath(this.props.pathID, this.props.soundIdx)}
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
