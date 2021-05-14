import SpaceTabContainer from 'containers/Spaces/SpacesTabContainer';
import baseTab from './BaseTab';
import './SpacesTab.scss';

const Spaces = () => (
  <div className="spaces-thumbnails-container">
    <SpaceTabContainer />
  </div>
);

export default baseTab('Spaces', Spaces);
