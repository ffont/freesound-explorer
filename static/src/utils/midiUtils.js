export const midiNoteNumberToMidiNoteLabel = (noteNumber) => {
  // let correspondingKey = '-';
  let octave = '';
  let noteLabel = '';
  octave = parseInt(Math.floor(noteNumber / 12) - 1, 10);
  noteLabel = 'C C#D D#E F F#G G#A A#B '
    .substring((noteNumber % 12) * 2, ((noteNumber % 12) * 2) + 2);
  if (noteLabel[1] === ' ') { noteLabel = noteLabel[0]; }
  return `${noteLabel}${octave}`;
};

export const midiMessageTypeLabel = (type) => {
  // let correspondingKey = '-';
  switch (type) {
    case 144: { // noteOn message
      return 'Note On';
    }
    case 128: { // noteOff message
      return 'Note Off';
    }
    default:
      return 'Unknown';
  }
};
