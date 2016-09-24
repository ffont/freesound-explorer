import React from 'react';
import baseTab from './BaseTab';
import SpaceTabContainer from '../../containers/Spaces/SpacesTabContainer';
import './SpacesTab.scss';

const Spaces = () => (
  <div className="spaces-thumbnails-container">
    <SpaceTabContainer />
  </div>
);

export default baseTab('Spaces', Spaces);
