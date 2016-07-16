import React from 'react';

const propTypes = {
  handleFreesoundLogin: React.PropTypes.func,
  handleFreesoundLogout: React.PropTypes.func,
  isUserLoggedIn: React.PropTypes.bool,
};

function LoginButton(props) {
  const content = (props.isUserLoggedIn) ?
    <a className="login-button" onClick={props.handleFreesoundLogout}>Logout</a> :
    <a className="login-button" onClick={props.handleFreesoundLogin}>Login</a>;
  return content;
}

LoginButton.propTypes = propTypes;
export default LoginButton;
