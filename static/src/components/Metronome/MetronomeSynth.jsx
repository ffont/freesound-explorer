import React from 'react';
import { TICKRESOLUTION } from '../../constants';
import AudioTickListener from '../App/AudioTickListener';

const propTypes = {
  audioContext: React.PropTypes.object,
};

class MetronomeSynth extends AudioTickListener {
  constructor(props) {
    super(props);
    this.state = {
      playSound: false,
    };
  }

  onAudioTick(bar, beat, tick, time) {
    if (this.state.playSound) {
      this.playMetronomeSound(tick, time);
    }
  }

  toggleMetronomeSound() {
    this.setState({
      playSound: !this.state.playSound,
    });
  }

  playMetronomeSound(tick, time) {
    // Play metronome sound (only quarter notes)
    if (tick % (TICKRESOLUTION / 4) === 0) {
      const frequency = (tick % TICKRESOLUTION === 0) ? 880.0 : 440.0;
      const osc = this.props.audioContext.createOscillator();
      osc.connect(this.props.audioContext.destination);
      osc.frequency.value = frequency;
      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  render() {
    return (
      <button onClick={() => this.toggleMetronomeSound()} >
        {(this.state.playSound) ?
          <i className="fa fa-volume-up fa-lg" aria-hidden="true" /> :
          <i className="fa fa-volume-off fa-lg" aria-hidden="true" />}
      </button>
    );
  }
}


MetronomeSynth.propTypes = propTypes;
export default MetronomeSynth;
