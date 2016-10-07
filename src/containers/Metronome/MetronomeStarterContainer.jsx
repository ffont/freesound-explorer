import React from 'react';
import { connect } from 'react-redux';
import { START_METRONOME_AT_MOUNT } from 'constants';
import { startMetronome } from './actions';

const propTypes = {
  startMetronome: React.PropTypes.func,
};

class MetronomeStarterContainer extends React.Component {

  componentDidMount() {
    if (START_METRONOME_AT_MOUNT) {
      this.props.startMetronome();
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({});

MetronomeStarterContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  startMetronome,
})(MetronomeStarterContainer);
