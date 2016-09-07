import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Metronome.scss';
import { setTempo, stopMetronome, startMetronome, setPlaySound } from '../../actions/metronome';
import SliderRange from '../Input/SliderRange';

const propTypes = {
  setTempo: React.PropTypes.func,
  tempo: React.PropTypes.number,
  isPlaying: React.PropTypes.bool,
  playSound: React.PropTypes.bool,
  stopMetronome: React.PropTypes.func,
  startMetronome: React.PropTypes.func,
  setPlaySound: React.PropTypes.func,
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
        Tempo<br />
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
          <button onClick={() => this.props.setPlaySound(!this.props.playSound)} >
            {(this.props.playSound) ?
              <i className="fa fa-volume-up fa-2x" aria-hidden="true" /> :
              <i className="fa fa-volume-off fa-2x" aria-hidden="true" />}
          </button>
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
  const { tempo, isPlaying, playSound } = state.metronome;
  return { tempo, isPlaying, playSound };
};

Metronome.propTypes = propTypes;
export default connect(mapStateToProps, {
  setTempo,
  stopMetronome,
  startMetronome,
  setPlaySound,
})(Metronome);
