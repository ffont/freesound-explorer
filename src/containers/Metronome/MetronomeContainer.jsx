import React from 'react';
import { connect } from 'react-redux';
import Metronome from 'components/Metronome';
import { setTempo, stopMetronome, startMetronome, setPlaySound } from './actions';

const propTypes = {
  setTempo: React.PropTypes.func,
  tempo: React.PropTypes.number,
  isPlaying: React.PropTypes.bool,
  shouldPlaySound: React.PropTypes.bool,
  stopMetronome: React.PropTypes.func,
  startMetronome: React.PropTypes.func,
  setPlaySound: React.PropTypes.func,
};

class MetronomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMetronome = this.toggleMetronome.bind(this);
  }

  toggleMetronome() {
    if (this.props.isPlaying) {
      this.props.stopMetronome();
    } else {
      this.props.startMetronome();
    }
  }

  render() {
    return (
      <Metronome
        tempo={this.props.tempo}
        setPlaySound={this.props.setPlaySound}
        shouldPlaySound={this.props.shouldPlaySound}
        toggleMetronome={this.toggleMetronome}
        isPlaying={this.props.isPlaying}
        setTempo={this.props.setTempo}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { tempo, isPlaying, shouldPlaySound } = state.metronome;
  return { tempo, isPlaying, shouldPlaySound };
};

MetronomeContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  setTempo,
  stopMetronome,
  startMetronome,
  setPlaySound,
})(MetronomeContainer);
