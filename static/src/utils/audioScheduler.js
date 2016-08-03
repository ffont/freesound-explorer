const lookahead = 25; // How often we'll call the scheduler function (in milliseconds)
const scheduleAheadTime = 0.2; // How far we schedule notes from lookahead call (in seconds)
let startTime = 0.0; // The start time of the entire sequence (should be restarted on play/stop)
let currentBar = 0;  // Global counter of current bar (should be restarted on play/stop)
let noteResolution = 16; // 16 for 16th note or 32 for 32th note
let currentNote = 0; // Currently las scheduled note
let tempo = 60.0; // tempo (in beats per minute)
let nextNoteTime = 0.0; // When the next note is due
let lastNoteDrawn = -1;  // Last note that was drawn on screen
const drawNotesInQueue = [];  // List of events that UI will use to draw

const ac = new window.AudioContext();

const playMetronome = ({ shouldTriggerAtTime, bar, beat, note }) => {
  // Play metronome sound (only quarter notes)
  if (note % noteResolution === 0) {  // first quarter note of bar (noteResolution = global)
    const osc = ac.createOscillator();
    osc.connect(ac.destination);
    osc.frequency.value = 880.0;
    osc.start(shouldTriggerAtTime);
    osc.stop(shouldTriggerAtTime + 0.05);
  } else if (note % (noteResolution / 4) === 0) {  // quarter note
    const osc = ac.createOscillator();
    osc.connect(ac.destination);
    osc.frequency.value = 440.0;
    osc.start(shouldTriggerAtTime);
    osc.stop(shouldTriggerAtTime + 0.05);
  }
};

const audioScheduler = () => {
  let currentTime = ac.currentTime;
  currentTime = currentTime - startTime;

  while (nextNoteTime < currentTime + scheduleAheadTime) {
    // scheduleNote( currentNote, nextNoteTime );
    if (nextNoteTime >= currentTime) {  // Avoid trying to play notes that were missed
      const normNextNoteTime = nextNoteTime + startTime;
      drawNotesInQueue.push({ note: currentNote, time: normNextNoteTime });

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
    }
    nextNoteTime += 4 / noteResolution * (60.0 / tempo);  // Advance by 16th note resolution
    currentNote++;  // Advance 16th note number, wrap to zero
    if (currentNote === noteResolution) {
      currentNote = 0;
      currentBar += 1;
    }
  }
  setTimeout(() => { audioScheduler(); }, lookahead);
};

const draw = () => {
  // Get most recent note that should be drawed
  let currentNoteToDraw = lastNoteDrawn;
  const currentTime = ac.currentTime;
  while (drawNotesInQueue.length && drawNotesInQueue[0].time < currentTime) {
    currentNoteToDraw = drawNotesInQueue[0].note;
    drawNotesInQueue.splice(0, 1);
  }
  if (lastNoteDrawn !== currentNoteToDraw) {
    // Call function to update UI here (called once per note)
    // NOTE: maybe simply set state og metronome here and react will re-render
    console.log('Metronome: ', currentBar + 1, ',', Math.floor(currentNote / (noteResolution / 4)) + 1, ',', currentNote + 1);
    lastNoteDrawn = currentNoteToDraw;
  }
  requestAnimationFrame(() => { draw(); });
};

requestAnimationFrame(() => { draw(); });

export default audioScheduler;
