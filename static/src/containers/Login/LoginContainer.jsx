import React from 'react';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../MessagesBox/actions';
import { updateLoginModalVisibilility, updateBackEndAuthSupport, updateUserLoggedStatus }
  from './actions';
import { loadJSON } from '../../utils/requests';
import Login from '../../components/Login';
import { MESSAGE_STATUS } from '../../constants';

const URLS = {
  login: '/login/freesound/',
  logout: '/logout/',
  prepareAuth: '/prepare_auth/',
  getAppToken: '/get_app_token/',
};

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

const getAppToken = () => new Promise((resolve, reject) => {
  loadJSON(URLS.getAppToken).then(
    (data) => {
      sessionStorage.setItem('appToken', data.appToken);
      // back-end app is running, inform with resolve()
      resolve();
    },
    () => {
      sessionStorage.setItem('appToken', staticAppToken);
      // client-only mode, inform with reject()
      reject();
    });
});

const propTypes = {
  isModalVisible: React.PropTypes.bool,
  isUserLoggedIn: React.PropTypes.bool,
  isEndUserAuthSupported: React.PropTypes.bool,
  updateLoginModalVisibilility: React.PropTypes.func,
  updateBackEndAuthSupport: React.PropTypes.func,
  updateUserLoggedStatus: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
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

  componentWillMount() {
    this.prepareAuth();
  }

  getAccessToken() {
    loadJSON(URLS.prepareAuth).then((data) => {
      setSessionStorage(data.accessToken, data.username);
      if (data.logged) {
        this.props.updateUserLoggedStatus(true);
      }
    });
  }

  prepareAuth() {
    clearSession();
    getAppToken().then(
      () => {
        // getAppToken success: back-end available
        this.props.updateBackEndAuthSupport(true);
        this.getAccessToken();
      },
      () => { // getAppToken error: no back-end available
      });
  }

  handleFreesoundLogin() {
    this.props.updateLoginModalVisibilility(true);
  }

  handleFreesoundLogout() {
    loadJSON(URLS.logout).then(() => {
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
        modalContentURL={URLS.login}
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
