import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadJSON } from 'utils/requests';
import Login from 'components/Login';
import { MESSAGE_STATUS, URLS } from 'constants';
import { displaySystemMessage } from '../MessagesBox/actions';
import { updateLoginModalVisibilility, updateBackEndAuthSupport, updateUserLoggedStatus }
  from './actions';

const staticAppToken = 'eecfe4981d7f41d2811b4b03a894643d5e33f812';

const clearSession = () => {
  const sessionKeys = ['username', 'accessToken'];
  sessionKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

const setSessionStorage = (accessToken, userName) => {
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('username', userName);
};

const useStaticAppToken = () => sessionStorage.setItem('appToken', staticAppToken);

const getAppToken = () => new Promise((resolve, reject) => {
  loadJSON(URLS.GET_APP_TOKEN).then(
    (data) => {
      sessionStorage.setItem('appToken', data.appToken);
      resolve();
    },
    () => {
      useStaticAppToken();
      reject();
    });
});

const propTypes = {
  isModalVisible: PropTypes.bool,
  isUserLoggedIn: PropTypes.bool,
  isEndUserAuthSupported: PropTypes.bool,
  updateLoginModalVisibilility: PropTypes.func,
  updateBackEndAuthSupport: PropTypes.func,
  updateUserLoggedStatus: PropTypes.func,
  displaySystemMessage: PropTypes.func,
};

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleFreesoundLogin = this.handleFreesoundLogin.bind(this);
    this.handleFreesoundLogout = this.handleFreesoundLogout.bind(this);
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleFailedLogin = this.handleFailedLogin.bind(this);
    window.setSessionStorage = setSessionStorage;
    window.handleSuccessfulLogin = this.handleSuccessfulLogin;
    window.handleFailedLogin = this.handleFailedLogin;
  }

  UNSAFE_componentWillMount() {
    this.prepareAuth();
  }

  getAccessToken() {
    loadJSON(URLS.PREPARE_AUTH).then((data) => {
      setSessionStorage(data.accessToken, data.username);
      if (data.logged) {
        this.props.updateUserLoggedStatus(true);
      }
    });
  }

  prepareAuth() {
    clearSession();
    if (window.isBackEndAvailable) {
      getAppToken().then(
        () => {
          this.props.updateBackEndAuthSupport(true);
          this.getAccessToken();
        });
    } else {
      useStaticAppToken();
    }
  }

  handleFreesoundLogin() {
    this.props.updateLoginModalVisibilility(true);
  }

  handleFreesoundLogout() {
    loadJSON(URLS.LOGOUT).then(() => {
      clearSession();
      this.props.updateUserLoggedStatus(false);
      this.props.displaySystemMessage('Logged out');
    });
  }

  handleSuccessfulLogin() {
    this.props.updateUserLoggedStatus(true);
    this.props.updateLoginModalVisibilility(false);
    this.props.displaySystemMessage(`Logged in as ${sessionStorage.getItem('username')}`,
      MESSAGE_STATUS.SUCCESS);
  }

  handleFailedLogin() {
    this.props.updateUserLoggedStatus(false);
    this.props.updateLoginModalVisibilility(false);
    this.props.displaySystemMessage('Failed to log in...', MESSAGE_STATUS.ERROR);
  }

  render() {
    if (!this.props.isEndUserAuthSupported) {
      return null;
    }
    return (
      <Login
        handleFreesoundLogin={this.handleFreesoundLogin}
        handleFreesoundLogout={this.handleFreesoundLogout}
        isUserLoggedIn={this.props.isUserLoggedIn}
        isModalVisible={this.props.isModalVisible}
        modalContentURL={URLS.LOGIN}
        setLoginModalVisibility={this.props.updateLoginModalVisibilility}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { isModalVisible, isUserLoggedIn, isEndUserAuthSupported } = state.login;
  return {
    isModalVisible,
    isUserLoggedIn,
    isEndUserAuthSupported,
  };
};

LoginContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage,
  updateLoginModalVisibilility,
  updateBackEndAuthSupport,
  updateUserLoggedStatus,
})(LoginContainer);
