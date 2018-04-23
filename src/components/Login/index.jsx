import React from 'react';
import PropTypes from 'prop-types';
import LoginButton from './LoginButton';
import LoginModal from './LoginModal';
import './Login.scss';

const propTypes = {
  handleFreesoundLogin: PropTypes.func,
  handleFreesoundLogout: PropTypes.func,
  isUserLoggedIn: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  modalContentURL: PropTypes.string,
  setLoginModalVisibility: PropTypes.func,
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
