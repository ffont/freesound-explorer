import React from 'react';
import { Provider } from 'react-redux';
import LoginContainer from 'containers/Login/LoginContainer';
import MapContainer from 'containers/Map/MapContainer';
import SidebarContainer from 'containers/Sidebar/SidebarContainer';
import MessagesBoxContainer from 'containers/MessagesBox/MessagesBoxContainer';
import MetronomeStarterContainer from 'containers/Metronome/MetronomeStarterContainer';
import MetronomeContainer from 'containers/Metronome/MetronomeContainer';
import ModalContainer from 'containers/Modal/ModalContainer';
import './App.scss';
import '../Modal/ModalContainer.scss';

const propTypes = {
  store: React.PropTypes.object,
};

const App = props => (
  <Provider store={props.store}>
    <div>
      <LoginContainer />
      <MetronomeContainer />
      <MapContainer />
      <SidebarContainer />
      <MessagesBoxContainer />
      <MetronomeStarterContainer />
      <ModalContainer />
    </div>
  </Provider>
);

App.propTypes = propTypes;
export default App;
