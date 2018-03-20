import React from 'react';
import './SoundListTab.scss';
import SoundListContainer from '../../containers/Sounds/SoundListContainer';
import baseTab from './BaseTab';

const SoundListTab = () => (
    <div className="soundlist-container">
      <SoundListContainer/>
    </div>
    );

export default baseTab('Sound-List', SoundListTab);    