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
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  tick: React.PropTypes.number,
  bottomArrowPosition: React.PropTypes.number,
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
        bar={this.props.bar}
        beat={this.props.beat}
        tick={this.props.tick}
        bottomArrowPosition={this.props.bottomArrowPosition}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { tempo, isPlaying, shouldPlaySound, bar, beat, tick } = state.metronome;
  const { bottomArrowPosition } = state.sidebar;
  return { tempo, isPlaying, shouldPlaySound, bar, beat, tick, bottomArrowPosition };
};

MetronomeContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  setTempo,
  stopMetronome,
  startMetronome,
  setPlaySound,
})(MetronomeContainer);
