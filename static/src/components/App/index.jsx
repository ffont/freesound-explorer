import React from 'react';
import { Provider } from 'react-redux';
import LoginContainer from '../../containers/Login/LoginContainer';
import MapContainer from '../../containers/Map/MapContainer';
import SidebarContainer from '../../containers/Sidebar/SidebarContainer';
import MessagesBoxContainer from '../../containers/MessagesBox/MessagesBoxContainer';
import MetronomeStarterContainer from '../../containers/Metronome/MetronomeStarterContainer';
import Logo from '../Logo';
// import Modal from '../Modal';
import './App.scss';

const propTypes = {
  store: React.PropTypes.object,
};

const App = props => (
  <Provider store={props.store}>
    <div>
      <LoginContainer />
      <MapContainer />
      <SidebarContainer />
      <MessagesBoxContainer />
      <Logo />
      <MetronomeStarterContainer />
      {/** <Modal /> */}
    </div>
  </Provider>
);

App.propTypes = propTypes;
export default App;
