import React from 'react';
import LoginContainer from '../../containers/Login/LoginContainer';
import MapContainer from '../../containers/Map/MapContainer';
// import Sidebar from '../Sidebar';
// import MessagesBox from '../MessagesBox';
// import Logo from '../Logo';
// import Modal from '../Modal';
import './App.scss';

function App() {
  return (
    <div>
      <LoginContainer />
      <MapContainer />
      {/** <Sidebar />
      <MessagesBox />
      <Logo />
      <Modal /> */}
    </div>
  );
}

export default App;
