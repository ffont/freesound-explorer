import React from 'react';
import MidiMappingsList from 'containers/Midi/MidiMappingsList.jsx';
import MidiInIndicator from 'containers/Midi/MidiInIndicator.jsx';
import baseTab from './BaseTab';
import './MidiTab.scss';

function MidiTab() {
  return (
    <div>
      <MidiInIndicator />
      <MidiMappingsList />
    </div>
  );
}

export default baseTab('MIDI Input', MidiTab);
