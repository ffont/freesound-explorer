import React from 'react';
import { Provider } from 'react-redux';
import LoginContainer from 'containers/Login/LoginContainer';
import MapContainer from 'containers/Map/MapContainer';
import SidebarContainer from 'containers/Sidebar/SidebarContainer';
import MessagesBoxContainer from 'containers/MessagesBox/MessagesBoxContainer';
import MetronomeStarterContainer from 'containers/Metronome/MetronomeStarterContainer';
import ModalContainer from 'containers/Modal/ModalContainer';
import Logo from '../Logo';
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
      <ModalContainer />
    </div>
  </Provider>
);

App.propTypes = propTypes;
export default App;
