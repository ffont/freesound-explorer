import React from 'react';
import LoginContainer from '../../containers/Login/LoginContainer';
import MapContainer from '../../containers/Map/MapContainer';
import SidebarContainer from '../../containers/Sidebar/SidebarContainer';
// import MessagesBox from '../MessagesBox';
// import Logo from '../Logo';
// import Modal from '../Modal';
import './App.scss';

function App() {
  return (
    <div>
      <LoginContainer />
      <MapContainer />
      <SidebarContainer />
      {/** <MessagesBox />
      <Logo />
      <Modal /> */}
    </div>
  );
}

export default App;
