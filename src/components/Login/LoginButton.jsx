import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  handleFreesoundLogin: PropTypes.func,
  handleFreesoundLogout: PropTypes.func,
  isUserLoggedIn: PropTypes.bool,
};

function LoginButton(props) {
  const username = (props.isUserLoggedIn) ? sessionStorage.getItem('username') : '';
  return (props.isUserLoggedIn) ?
    (<a className="login-button" onClick={props.handleFreesoundLogout}>
      <span className="username">{username}</span>
      <i className="fa fa-user-times fa-2x" aria-hidden="true" />
    </a>) :
    (<a className="login-button" onClick={props.handleFreesoundLogin}>
      <i className="fa fa-user fa-2x" aria-hidden="true" />
    </a>);
}

LoginButton.propTypes = propTypes;
export default LoginButton;
