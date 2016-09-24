import React from 'react';
import PathList from 'containers/Paths/PathList.jsx';
import baseTab from './BaseTab';
import './PathsTab.scss';

function PathsTab() {
  return (
    <div>
      <PathList />
    </div>
  );
}

export default baseTab('Paths', PathsTab);
