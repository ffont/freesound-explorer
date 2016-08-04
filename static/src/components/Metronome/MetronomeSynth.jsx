import React from 'react';
import { TICKRESOLUTION } from '../../constants';

const propTypes = {
  audioContext: React.PropTypes.object,
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  tick: React.PropTypes.number,
  time: React.PropTypes.number,
};

class MetronomeSynth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playSound: false,
    };
  }

  componentDidMount() {
    window.addEventListener('tick', (e) => {
      this.scheduleAudioEvents(e.detail.bar, e.detail.beat, e.detail.tick, e.detail.time);
    }, false);
  }

  componentWillUnmount() {
    window.removeEventListener('tick');
  }

  toggleMetronomeSound() {
    this.setState({
      playSound: !this.state.playSound,
    });
  }

  scheduleAudioEvents(bar, beat, tick, time) {
    // console.log("Scheduling audio events", bar, beat, tick, time);
    if (this.state.playSound) {
      this.playMetronomeSound(tick, time);
    }
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
