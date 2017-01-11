import React from 'react';
import SliderRange from '../Input/SliderRange';
import './Metronome.scss';

const propTypes = {
  tempo: React.PropTypes.number,
  setTempo: React.PropTypes.func,
  shouldPlaySound: React.PropTypes.bool,
  toggleMetronome: React.PropTypes.func,
  isPlaying: React.PropTypes.bool,
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  tick: React.PropTypes.number,
  bottomArrowPosition: React.PropTypes.number,
  isRecording: React.PropTypes.bool,
  toggleRecording: React.PropTypes.func,
};

const Metronome = props => (
  <div className="Metronome__wrapper" style={{ bottom: props.bottomArrowPosition }}>
    <div className="Metronome__slider">
      <SliderRange
        label=""
        minValue="40"
        maxValue="300"
        onChange={(evt) => {
          const newTempo = evt.target.value;
          props.setTempo(parseInt(newTempo, 10));
        }}
        currentValue={props.tempo}
        tabIndex="0"
        id="max-results-slider"
      />
    </div>
    <div className="Metronome__position">
      <ul>
        <li>{props.bar}</li>
        <li>{props.beat}</li>
        <li>{props.tick}</li>
      </ul>
    </div>
    <div className="Metronome__controls">
      <button onClick={props.toggleMetronome} >
        {(props.isPlaying) ?
          <i className="fa fa-stop fa-2x" aria-hidden="true" /> :
          <i className="fa fa-play fa-2x" aria-hidden="true" />}
      </button>
      <button onClick={props.toggleRecording}>
        {(props.isRecording) ?
          <i className="fa fa-circle fa-2x Metronome__recording" aria-hidden="true" /> :
          <i className="fa fa-circle fa-2x" aria-hidden="true" />}
      </button>
    </div>
  </div>
);

Metronome.propTypes = propTypes;
export default Metronome;
