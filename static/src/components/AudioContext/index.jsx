import React from 'react';
import { connect } from 'react-redux';
import { initAudio } from '../../actions/audio';

const propTypes = {
  initAudio: React.PropTypes.func,
};

class Audio extends React.Component {
  componentWillMount() {
    this.props.initAudio();
  }
  render() {
    return null;
  }
}

Audio.propTypes = propTypes;
export default connect(() => ({}), { initAudio })(Audio);
