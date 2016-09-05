import React from 'react';
import baseTab from './BaseTab';
import MidiMappingsList from '../MIDI/MidiMappginsList';
import MidiInIndicator from '../MIDI/MidiInIndicator';

function MidiTab() {
  return (
    <div>
      <MidiInIndicator />
      <MidiMappingsList />
    </div>
  );
}

export default baseTab('MIDI Input', MidiTab);
