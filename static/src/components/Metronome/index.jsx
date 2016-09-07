import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Metronome.scss';
import MetronomeSynth from './MetronomeSynth';
import { setTempo, stopMetronome, startMetronome } from '../../actions/metronome';
import { audioContext } from '../../actions/audio';
import SliderRange from '../Input/SliderRange';


const propTypes = {
  setTempo: React.PropTypes.func,
  tempo: React.PropTypes.number,
  isPlaying: React.PropTypes.bool,
  stopMetronome: React.PropTypes.func,
  startMetronome: React.PropTypes.func,
};

class Metronome extends React.Component {

  startStopMetronome() {
    if (this.props.isPlaying) {
      this.props.stopMetronome();
    } else {
      this.props.startMetronome();
    }
  }

  render() {
    return (
      <div className="metronome-wrapper">
        <div className="metronome-slider">
          <SliderRange
            label=""
            minValue="40"
            maxValue="300"
            defaultValue={this.props.tempo}
            onChange={(evt) => {
              const newTempo = evt.target.value;
              this.props.setTempo(parseInt(newTempo, 10));
            }}
            currentValue={this.props.tempo}
            tabIndex="4"
            id="max-results-slider"
          />
        </div>
        <div className="metronome-controls">
          <MetronomeSynth audioContext={audioContext} />
          <button onClick={() => this.startStopMetronome()} >
            {(this.props.isPlaying) ?
              <i className="fa fa-stop fa-2x" aria-hidden="true" /> :
              <i className="fa fa-play fa-2x" aria-hidden="true" />}
          </button>
        </div>
      </div>
      );
  }
}

const mapStateToProps = (state) => {
  const { tempo, isPlaying } = state.metronome;
  return { tempo, isPlaying };
};

Metronome.propTypes = propTypes;
export default connect(mapStateToProps, {
  setTempo,
  stopMetronome,
  startMetronome,
})(Metronome);
