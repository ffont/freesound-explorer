import React from 'react';
import PathsList from './PathsList';
import Metronome from '../Metronome';
import baseTab from './BaseTab';

function PathsTab() {
  return (
    <div>
      <Metronome />
      <PathsList />
    </div>
  );
}

export default baseTab('Paths', PathsTab);
