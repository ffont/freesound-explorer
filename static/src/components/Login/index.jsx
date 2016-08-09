import React from 'react';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../../actions/messagesBox';
import { updateLoginModalVisibilility, updateBackEndAuthSupport, updateUserLoggedStatus }
  from '../../actions/login';
import { loadJSON } from '../../utils/misc';
import LoginModal from './LoginModal';
import LoginButton from './LoginButton';
import '../../stylesheets/Login.scss';
import '../../polyfills/Array.includes';

const URLS = {
  login: '/login/freesound/',
  logout: '/logout/',
  prepareAuth: '/prepare_auth/',
  getAppToken: '/get_app_token/',
};

const staticAppToken = 'eecfe4981d7f41d2811b4b03a894643d5e33f812';

const clearSession = () => {
  const sessionKeys = ['username', 'access_token'];
  sessionKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

const getAppToken = () => new Promise((resolve, reject) => {
  loadJSON(URLS.getAppToken).then(
    data => {
      sessionStorage.setItem('app_token', data.app_token);
      // we can safely assume a back-end app is running, inform with resolve()
      resolve();
    },
    () => {
      sessionStorage.setItem('app_token', staticAppToken);
      // we can safely assume we're in client-only mode, inform with reject()
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
  setSessionStorage: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleFreesoundLogin = this.handleFreesoundLogin.bind(this);
    this.handleFreesoundLogout = this.handleFreesoundLogout.bind(this);
  }

  componentWillMount() {
    this.prepareAuth();
  }

  getAccessToken() {
    loadJSON(URLS.prepareAuth).then((data) => {
      this.props.setSessionStorage(data.access_token, data.username);
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

  render() {
    if (!this.props.isEndUserAuthSupported) {
      return null;
    }
    return (
      <div>
        <LoginButton
          handleFreesoundLogin={this.handleFreesoundLogin}
          handleFreesoundLogout={this.handleFreesoundLogout}
          isUserLoggedIn={this.props.isUserLoggedIn}
        />
        <LoginModal
          isVisible={this.props.isModalVisible}
          contentURL={URLS.login}
          setLoginModalVisibility={this.props.updateLoginModalVisibilility}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { setSessionStorage } = ownProps;
  const { isModalVisible, isUserLoggedIn, isEndUserAuthSupported } = state;
  return {
    isModalVisible,
    isUserLoggedIn,
    isEndUserAuthSupported,
    setSessionStorage,
  };
};

Login.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage,
  updateLoginModalVisibilility,
  updateBackEndAuthSupport,
  updateUserLoggedStatus,
})(Login);
