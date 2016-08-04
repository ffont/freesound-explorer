import React from 'react';
import '../../stylesheets/Metronome.scss';
import MetronomeSynth from './MetronomeSynth';
import { LOOKAHEAD, SCHEDULEAHEADTIME, NOTERESOLUTION, DEFAULT_TEMPO } from '../../constants';
import { connect } from 'react-redux';
import { updateMetronomeInfo } from '../../actions';


const propTypes = {
  audioContext: React.PropTypes.object,
  updateMetronomeInfo: React.PropTypes.func,
  bar: React.PropTypes.number,
  beat: React.PropTypes.number,
  note: React.PropTypes.number,
};

class Metronome extends React.Component {
  constructor(props) {
    super(props);
    this.schedulerTimer = undefined;
    this.updateStateInSyncTimer = undefined;
    this.state = {
      isPlaying: false,
      tempo: DEFAULT_TEMPO, // tempo (in beats per minute)
    };
  }

  setTempo(newTempo) {
    this.setState({
      tempo: newTempo,
    });
  }

  startMetronome() {
    this.lastNoteDrawn = -1;
    this.drawNotesInQueue = [];
    this.currentNote = 0;
    this.currentBar = 1;
    this.setState({ isPlaying: true });
    const [bar, note, time] = [1, 0, 0];
    this.props.updateMetronomeInfo(bar, note, time);
    this.nextNoteTime = this.props.audioContext.currentTime;
    this.schedulerTimer = setTimeout(() => { this.audioScheduler(); }, LOOKAHEAD);
    this.updateStateInSyncTimer = requestAnimationFrame(() => this.updateStateInSync());
  }

  stopMetronome() {
    clearTimeout(this.schedulerTimer);
    cancelAnimationFrame(this.updateStateInSyncTimer);
    const [bar, note, time] = [1, 0, 0];
    this.props.updateMetronomeInfo(bar, note, time);
    this.setState({ isPlaying: false });
  }

  startStopMetronome() {
    if (this.state.isPlaying) {
      this.stopMetronome();
    } else {
      this.startMetronome();
    }
  }

  audioScheduler() {
    const currentTime = this.props.audioContext.currentTime;
    while (this.nextNoteTime < currentTime + SCHEDULEAHEADTIME) {
      // Avoid trying to play notes that were missed by more than 10ms
      if (this.nextNoteTime >= (currentTime - 0.05)) {
        // Store metronome info in redux store so other components can access it
        const bar = this.currentBar;
        const beat = Math.floor(this.currentNote / (NOTERESOLUTION / 4));
        const note = this.currentNote;
        const time = this.nextNoteTime;

        // Trigger event
        const event = new CustomEvent('note', { detail: { bar, beat, note, time } });
        window.dispatchEvent(event);

        // Add note info to queue for updating display
        this.drawNotesInQueue.push({ note, time });
      }
      // Advance to next note according to note resolution
      this.nextNoteTime += 4 / NOTERESOLUTION * (60.0 / this.state.tempo);
      this.currentNote += 1;
      if (this.currentNote === NOTERESOLUTION) {
        this.currentNote = 0;
        this.currentBar += 1;
      }
    }
    this.schedulerTimer = setTimeout(() => { this.audioScheduler(); }, LOOKAHEAD);
  }

  updateStateInSync() {
    if (this.state.isPlaying) {
      let currentNoteToDraw = this.lastNoteDrawn;
      const currentTime = this.props.audioContext.currentTime;
      while (this.drawNotesInQueue.length && this.drawNotesInQueue[0].time < currentTime) {
        currentNoteToDraw = this.drawNotesInQueue[0].note;
        this.drawNotesInQueue.splice(0, 1);
      }
      if (this.lastNoteDrawn !== currentNoteToDraw) {
        // Call function to update UI here (called once per note)
        const bar = this.currentBar;
        const beat = Math.floor(this.currentNote / (NOTERESOLUTION / 4));
        const note = this.currentNote;
        this.props.updateMetronomeInfo(bar, beat, note);
        this.lastNoteDrawn = currentNoteToDraw;
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
      {this.state.tempo} :: {this.props.bar} | {this.props.beat + 1}
        <MetronomeSynth audioContext={this.props.audioContext} />
        <button onClick={() => this.startStopMetronome()} >
          {(this.state.isPlaying) ?
            <i className="fa fa-stop fa-lg" aria-hidden="true" /> :
            <i className="fa fa-play fa-lg" aria-hidden="true" />}
        </button>

      </div>
      );
  }
}

const mapStateToProps = (state) => {
  const { bar, beat, note } = state.metronome;
  return { bar, beat, note };
};

Metronome.propTypes = propTypes;
export default connect(mapStateToProps, {
  updateMetronomeInfo,
})(Metronome);
