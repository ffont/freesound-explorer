import React from 'react';
import { connect } from 'react-redux';
import Metronome from 'components/Metronome';
import { setTempo, stopMetronome, startMetronome } from './actions';
import { record } from '../Recorder/actions';

const propTypes = {
  setTempo: React.PropTypes.func,
  tempo: React.PropTypes.number,
  isPlaying: React.PropTypes.bool,
  shouldPlaySound: React.PropTypes.bool,
  stopMetronome: React.PropTypes.func,
  startMetronome: React.PropTypes.func,
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  tick: React.PropTypes.number,
  bottomArrowPosition: React.PropTypes.number,
  record: React.PropTypes.func,
  isRecording: React.PropTypes.bool,
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
        shouldPlaySound={this.props.shouldPlaySound}
        toggleMetronome={this.toggleMetronome}
        isPlaying={this.props.isPlaying}
        setTempo={this.props.setTempo}
        bar={this.props.bar}
        beat={this.props.beat}
        tick={this.props.tick}
        bottomArrowPosition={this.props.bottomArrowPosition}
        isRecording={this.props.isRecording}
        toggleRecording={this.props.record}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { tempo, isPlaying, bar, beat, tick } = state.metronome;
  const shouldPlaySound = state.settings.shouldPlayMetronomeSound;
  const { bottomArrowPosition } = state.sidebar;
  const isRecording = state.recorder.isRecording;
  // TODO: isRecording should be stored/read from some store to get visual feedback
  return { tempo, isPlaying, shouldPlaySound, bar, beat, tick, bottomArrowPosition, isRecording };
};

MetronomeContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  setTempo,
  stopMetronome,
  startMetronome,
  record,
})(MetronomeContainer);
