import React from 'react';
import PathList from '../Paths/PathList';
import baseTab from './BaseTab';

function PathsTab() {
  return (
    <div>
      <PathList />
    </div>
  );
}

export default baseTab('Paths', PathsTab);
