import React from 'react';
import '../../stylesheets/Metronome.scss';
import MetronomeSynth from './MetronomeSynth';
import { LOOKAHEAD, SCHEDULEAHEADTIME, TICKRESOLUTION, DEFAULT_TEMPO } from '../../constants';
import { connect } from 'react-redux';
import { updateMetronomeStatus, setTempo, startStopMetronome } from '../../actions';


const propTypes = {
  audioContext: React.PropTypes.object,
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
    this.nextTickTime = this.props.audioContext.currentTime;
    this.schedulerTimer = setTimeout(() => { this.audioScheduler(); }, LOOKAHEAD);
    this.updateStateInSyncTimer = requestAnimationFrame(() => this.updateStateInSync());
  }

  stopMetronome() {
    clearTimeout(this.schedulerTimer);
    cancelAnimationFrame(this.updateStateInSyncTimer);
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
    const currentTime = this.props.audioContext.currentTime;
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
        this.drawTicksInQueue.push({ tick, time });
      }
      // Advance to next tick according to tick resolution
      this.nextTickTime += 4 / TICKRESOLUTION * (60.0 / this.props.tempo);
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
      let currentTickToDraw = this.lastTickDrawn;
      const currentTime = this.props.audioContext.currentTime;
      while (this.drawTicksInQueue.length && this.drawTicksInQueue[0].time < currentTime) {
        currentTickToDraw = this.drawTicksInQueue[0].tick;
        this.drawTicksInQueue.splice(0, 1);
      }
      if (this.lastTickDrawn !== currentTickToDraw) {
        // Call function to update UI here (called once per tick)
        const bar = this.currentBar;
        const beat = Math.floor(this.currentTick / (TICKRESOLUTION / 4));
        const tick = this.currentTick;
        this.props.updateMetronomeStatus(bar, beat, tick);
        this.lastTickDrawn = currentTickToDraw;
      }
      // Call this function at every requestAnimationFrame
      this.updateStateInSyncTimer = requestAnimationFrame(() => { this.updateStateInSync(); });
    }
  }

  render() {
    return (
      <div className="metronome">
        <input
          id="max-results-slider"
          className="max-results-slider"
          type="range" onChange={(evt) => this.setTempo(parseInt(evt.target.value, 10))}
          min="40" max="300" defaultValue={DEFAULT_TEMPO} step="1"
        /><br />
      {this.props.tempo} :: {this.props.bar} | {this.props.beat + 1}
        <MetronomeSynth audioContext={this.props.audioContext} />
        <button onClick={() => this.startStopMetronome()} >
          {(this.props.isPlaying) ?
            <i className="fa fa-stop fa-lg" aria-hidden="true" /> :
            <i className="fa fa-play fa-lg" aria-hidden="true" />}
        </button>

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
