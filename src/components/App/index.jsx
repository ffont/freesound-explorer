import React from 'react';
import { Provider } from 'react-redux';
import LoginContainer from 'containers/Login/LoginContainer.jsx';
import MapContainer from 'containers/Map/MapContainer.jsx';
import SidebarContainer from 'containers/Sidebar/SidebarContainer.jsx';
import MessagesBoxContainer from 'containers/MessagesBox/MessagesBoxContainer.jsx';
import MetronomeStarterContainer from 'containers/Metronome/MetronomeStarterContainer.jsx';
import ModalContainer from 'containers/Modal/ModalContainer.jsx';
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
