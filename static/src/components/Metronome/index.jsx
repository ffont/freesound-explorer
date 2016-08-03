import React from 'react';
import '../../stylesheets/Metronome.scss';
import { LOOKAHEAD, SCHEDULEAHEADTIME, NOTERESOLUTION } from '../../constants';

const propTypes = {
  audioContext: React.PropTypes.object,
};

class Metronome extends React.Component {
  constructor(props) {
    super(props);
    this.schedulerTimer = undefined;
    this.updateStateInSyncTimer = undefined;
    this.state = {
      isPlaying: false,
      playSound: false,
      tempo: 120.0, // tempo (in beats per minute)
      bar: 1,  // Global counter of current bar (should be restarted on play/stop)
      beat: 1, // Current beat
      note: 1, // Currently las scheduled note
    };
  }

  startMetronome() {
    this.startTime = this.props.audioContext.currentTime;
    this.nextNoteTime = 0.0;
    this.lastNoteDrawn = -1;
    this.drawNotesInQueue = [];
    this.currentNote = 0;
    this.currentBar = 0;
    this.setState({
      isPlaying: true,
      bar: 1,
      beat: 1,
      note: 1,
    });
    this.audioScheduler();
    this.schedulerTimer = setInterval(() => { this.audioScheduler(); }, LOOKAHEAD);
    this.updateStateInSyncTimer = requestAnimationFrame(() => this.updateStateInSync());
  }

  stopMetronome() {
    clearInterval(this.schedulerTimer);
    cancelAnimationFrame(this.updateStateInSyncTimer);
    this.setState({
      isPlaying: false,
      bar: 1,
      beat: 1,
      note: 1,
    });
  }

  startStopMetronome() {
    if (this.state.isPlaying) {
      this.stopMetronome();
    } else {
      this.startMetronome();
    }
  }

  audioScheduler() {
    let currentTime = this.props.audioContext.currentTime;
    currentTime = currentTime - this.startTime;

    while (this.nextNoteTime < currentTime + SCHEDULEAHEADTIME) {
      // scheduleNote( currentNote, nextNoteTime );
      if (this.nextNoteTime >= currentTime) {  // Avoid trying to play notes that were missed
        const normNextNoteTime = this.nextNoteTime + this.startTime;
        this.drawNotesInQueue.push({ note: this.currentNote, time: normNextNoteTime });

        // Here we should let elements that should play notes in sync with the tempo
        // what will the next note time be so that they can program start events if needed
        // This funcion will be called once for each note (at specified resolution with respect
        // to tempo).
        // For example, if noteResolution is set to 16, at every 16th note of the given tempo
        // this function should be called.
        // Parameters for this function should include relevant timing information so that
        // receiver can decide whether to program audio events or not.
        // Example:
        /*
        playMetronome({
          shouldTriggerAtTime: normNextNoteTime,
          bar: currentBar + 1,
          beat: Math.floor(currentNote / (noteResolution / 4)) + 1,
          note: currentNote + 1,
        });
        */
        if (this.state.playSound) {
          this.playMetronomeSound(normNextNoteTime, this.currentNote);
        }
      }
      // Advance to next note according to note resolution
      this.nextNoteTime += 4 / NOTERESOLUTION * (60.0 / this.state.tempo);
      this.currentNote += 1;
      if (this.currentNote === NOTERESOLUTION) {
        this.currentNote = 0;
        this.currentBar += 1;
      }
    }
  }

  updateStateInSync() {
    if (this.state.isPlaying) {
      // Get most recent note that should be drawed
      let currentNoteToDraw = this.lastNoteDrawn;
      const currentTime = this.props.audioContext.currentTime;
      while (this.drawNotesInQueue.length && this.drawNotesInQueue[0].time < currentTime) {
        currentNoteToDraw = this.drawNotesInQueue[0].note;
        this.drawNotesInQueue.splice(0, 1);
      }
      if (this.lastNoteDrawn !== currentNoteToDraw) {
        // Call function to update UI here (called once per note)
        this.setState({
          bar: this.currentBar + 1,
          beat: Math.floor(this.currentNote / (NOTERESOLUTION / 4)) + 1,
          note: this.currentNote + 1,
        });
        this.lastNoteDrawn = currentNoteToDraw;
      }
      // Call this function at every requestAnimationFrame
      this.updateStateInSyncTimer = requestAnimationFrame(() => { this.updateStateInSync(); });
    }
  }

  playMetronomeSound(time, note) {
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
      <div className="metronome">
        {this.state.bar} | {this.state.beat} | {this.state.note}
        <button onClick={() => this.startStopMetronome()} >
          {(this.state.isPlaying) ?
            <i className="fa fa-stop fa-lg" aria-hidden="true" /> :
            <i className="fa fa-play fa-lg" aria-hidden="true" />}
        </button>

      </div>
      );
  }
}

Metronome.propTypes = propTypes;
export default Metronome;
