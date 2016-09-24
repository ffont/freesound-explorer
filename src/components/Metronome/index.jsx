import React from 'react';
import SliderRange from '../Input/SliderRange';
import './Metronome.scss';

const propTypes = {
  tempo: React.PropTypes.number,
  setTempo: React.PropTypes.func,
  setPlaySound: React.PropTypes.func,
  shouldPlaySound: React.PropTypes.bool,
  toggleMetronome: React.PropTypes.func,
  isPlaying: React.PropTypes.bool,
};

const Metronome = props => (
  <div className="metronome-wrapper">
    <div className="metronome-slider">
      <SliderRange
        label="Tempo"
        minValue="40"
        maxValue="300"
        defaultValue={props.tempo}
        onChange={(evt) => {
          const newTempo = evt.target.value;
          props.setTempo(parseInt(newTempo, 10));
        }}
        currentValue={props.tempo}
        tabIndex="0"
        id="max-results-slider"
      />
    </div>
    <div className="metronome-controls">
      <button onClick={() => props.setPlaySound(!props.shouldPlaySound)} >
        {(props.shouldPlaySound) ?
          <i className="fa fa-volume-up fa-2x" aria-hidden="true" /> :
          <i className="fa fa-volume-off fa-2x" aria-hidden="true" />}
      </button>
      <button onClick={props.toggleMetronome} >
        {(props.isPlaying) ?
          <i className="fa fa-stop fa-2x" aria-hidden="true" /> :
          <i className="fa fa-play fa-2x" aria-hidden="true" />}
      </button>
    </div>
  </div>
);

Metronome.propTypes = propTypes;
export default Metronome;
