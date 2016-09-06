import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Metronome.scss';
import MetronomeSynth from './MetronomeSynth';
import { LOOKAHEAD, SCHEDULEAHEADTIME, TICKRESOLUTION, DEFAULT_TEMPO } from '../../constants';
import { updateMetronomeStatus, setTempo, startStopMetronome } from '../../actions/metronome';
import { audioContext } from '../../actions/audio';
import SliderRange from '../Input/SliderRange';


const propTypes = {
  updateMetronomeStatus: React.PropTypes.func,
  setTempo: React.PropTypes.func,
  startStopMetronome: React.PropTypes.func,
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  tick: React.PropTypes.number,
  tempo: React.PropTypes.number,
  isPlaying: React.PropTypes.bool,
};

class Metronome extends React.Component {
  constructor(props) {
    super(props);
    this.schedulerTimer = undefined;
    this.updateStateInSyncTimer = undefined;
  }

  setTempo(newTempo) {
    this.props.setTempo(newTempo);
  }

  startMetronome() {
    this.lastTickDrawn = -1;
    this.drawTicksInQueue = [];
    this.currentTick = 0;
    this.currentBar = 1;
    const [bar, beat, tick] = [1, 0, 0];
    this.props.updateMetronomeStatus(bar, beat, tick);
    this.props.startStopMetronome(true);
    this.nextTickTime = audioContext.currentTime;
    this.schedulerTimer = setTimeout(() => { this.audioScheduler(); }, LOOKAHEAD);
    this.updateStateInSyncTimer = setTimeout(() => { this.updateStateInSync(); }, LOOKAHEAD * 2);
  }

  stopMetronome() {
    clearTimeout(this.schedulerTimer);
    clearTimeout(this.updateStateInSyncTimer);
    this.props.startStopMetronome(false);
    const [bar, beat, tick] = [1, 0, 0];
    this.props.updateMetronomeStatus(bar, beat, tick);
  }

  startStopMetronome() {
    if (this.props.isPlaying) {
      this.stopMetronome();
    } else {
      this.startMetronome();
    }
  }

  audioScheduler() {
    const currentTime = audioContext.currentTime;
    while (this.nextTickTime < currentTime + SCHEDULEAHEADTIME) {
      // Avoid trying to play ticks that were missed by more than 50ms
      if (this.nextTickTime >= (currentTime - 0.05)) {
        // Trigger tick event
        const bar = this.currentBar;
        const beat = Math.floor(this.currentTick / (TICKRESOLUTION / 4));
        const tick = this.currentTick;
        const time = this.nextTickTime;
        const event = new CustomEvent('tick', { detail: { bar, beat, tick, time } });
        window.dispatchEvent(event);

        // Add tick info to queue for updating display
        this.drawTicksInQueue.push({ bar, beat, tick, time });
      }
      // Advance to next tick according to tick resolution
      this.nextTickTime += (4 / TICKRESOLUTION) * (60.0 / this.props.tempo);
      this.currentTick += 1;
      if (this.currentTick === TICKRESOLUTION) {
        this.currentTick = 0;
        this.currentBar += 1;
      }
    }
    this.schedulerTimer = setTimeout(() => { this.audioScheduler(); }, LOOKAHEAD);
  }

  updateStateInSync() {
    if (this.props.isPlaying) {
      const currentTime = audioContext.currentTime;
      let currentTickToDraw = this.lastTickDrawn;
      while (this.drawTicksInQueue.length && this.drawTicksInQueue[0].time < currentTime) {
        currentTickToDraw = Object.assign({}, this.drawTicksInQueue[0]);
        this.drawTicksInQueue.splice(0, 1);
      }
      if (this.lastTickDrawn.tick !== currentTickToDraw.tick) {
        // Update metronome status so UI is updated too
        this.props.updateMetronomeStatus(
          currentTickToDraw.bar,
          currentTickToDraw.beat,
          currentTickToDraw.tick
        );
        this.lastTickDrawn = currentTickToDraw;
      }
      // Call this function at every requestAnimationFrame
      this.updateStateInSyncTimer = setTimeout(() => { this.updateStateInSync(); }, LOOKAHEAD * 2);
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
              this.setTempo(parseInt(newTempo, 10));
            }}
            currentValue={this.props.tempo}
            tabIndex="4"
            id="max-results-slider"
          />
        </div>
        <div className="metronome-controls">
          {/* <div className="metronome-transport">
            {this.props.bar} | {this.props.beat + 1} | {this.props.tick + 1}
          </div>*/}
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
  const { bar, beat, tick, tempo, isPlaying } = state.metronome;
  return { bar, beat, tick, tempo, isPlaying };
};

Metronome.propTypes = propTypes;
export default connect(mapStateToProps, {
  updateMetronomeStatus,
  setTempo,
  startStopMetronome,
})(Metronome);
