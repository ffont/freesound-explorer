import React from 'react';
import LoginButton from './LoginButton';
import LoginModal from './LoginModal';
import './Login.scss';

const propTypes = {
  handleFreesoundLogin: React.PropTypes.func,
  handleFreesoundLogout: React.PropTypes.func,
  isUserLoggedIn: React.PropTypes.bool,
  isModalVisible: React.PropTypes.bool,
  modalContentURL: React.PropTypes.string,
  setLoginModalVisibility: React.PropTypes.func,
};

const Login = (props) => (
  <div>
    <LoginButton
      handleFreesoundLogin={props.handleFreesoundLogin}
      handleFreesoundLogout={props.handleFreesoundLogout}
      isUserLoggedIn={props.isUserLoggedIn}
    />
    <LoginModal
      isVisible={props.isModalVisible}
      contentURL={props.modalContentURL}
      setLoginModalVisibility={props.setLoginModalVisibility}
    />
  </div>
);

Login.propTypes = propTypes;
export default Login;
