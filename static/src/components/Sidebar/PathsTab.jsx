import React from 'react';
import PathsList from './PathsList';
import Metronome from '../Metronome';

function PathsTab() {
  return (
    <div>
      <header><h1>Paths</h1></header>
      <Metronome />
      <PathsList />
    </div>
  );
}

export default PathsTab;
