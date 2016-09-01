import React from 'react';
import PathList from '../Paths/PathList';
import Metronome from '../Metronome';
import baseTab from './BaseTab';

function PathsTab() {
  return (
    <div>
      <Metronome />
      <PathList />
    </div>
  );
}

export default baseTab('Paths', PathsTab);
