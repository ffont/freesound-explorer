import './SoundListTab.scss';
import SoundListWrapper from '../../components/Sounds/SoundListWrapper';
import baseTab from './BaseTab';

const SoundListTab = () => (
  <div className="soundlist-container">
    <SoundListWrapper />
  </div>
  );

export default baseTab('Sound-List', SoundListTab);
