import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Metronome from 'components/Metronome';
import { setTempo, stopMetronome, startMetronome } from './actions';
import { record } from '../Recorder/actions';

const propTypes = {
  setTempo: PropTypes.func,
  tempo: PropTypes.number,
  isPlaying: PropTypes.bool,
  shouldPlaySound: PropTypes.bool,
  stopMetronome: PropTypes.func,
  startMetronome: PropTypes.func,
  bar: PropTypes.number,
  beat: PropTypes.number,
  tick: PropTypes.number,
  bottomArrowPosition: PropTypes.number,
  record: PropTypes.func,
  isRecording: PropTypes.bool,
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
