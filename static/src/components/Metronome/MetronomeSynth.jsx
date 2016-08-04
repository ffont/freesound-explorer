import React from 'react';
import { NOTERESOLUTION } from '../../constants';

const propTypes = {
  audioContext: React.PropTypes.object,
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  note: React.PropTypes.number,
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
    window.addEventListener('note', (e) => {
      this.scheduleAudioEvents(e.detail.bar, e.detail.beat, e.detail.note, e.detail.time);
    }, false);
  }

  componentWillUnmount() {
    window.removeEventListener('note');
  }

  toggleMetronomeSound() {
    this.setState({
      playSound: !this.state.playSound,
    });
  }

  scheduleAudioEvents(bar, beat, note, time) {
    // console.log("Scheduling audio events", bar, beat, note, time);
    if (this.state.playSound) {
      this.playMetronomeSound(note, time);
    }
  }

  playMetronomeSound(note, time) {
    // Play metronome sound (only quarter notes)
    if (note % (NOTERESOLUTION / 4) === 0) {
      const frequency = (note % NOTERESOLUTION === 0) ? 880.0 : 440.0;
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
