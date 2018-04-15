import React from 'react';
import './SoundListTab.scss';
import SoundListWrapper from '../../components/Sounds/SoundListWrapper';
import baseTab from './BaseTab';

      
// TODO: get in the real sound properties!

const SoundListTab = () => (
    <div className="soundlist-container">
      <SoundListWrapper/>
    </div>
    );

export default baseTab('Sound-List', SoundListTab);    