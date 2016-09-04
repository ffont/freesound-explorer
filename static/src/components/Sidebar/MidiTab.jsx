import React from 'react';
import baseTab from './BaseTab';
import MidiMappingsList from '../MIDI/MidiMappginsList';

function MidiTab() {
  return (
    <MidiMappingsList />
  );
}

export default baseTab('MIDI Mappings', MidiTab);
