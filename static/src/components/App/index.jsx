import React from 'react';
import Map from '../Map';
import Login from '../Login';
import Logo from '../Logo';
import Sidebar from '../Sidebar';
import MessagesBox from '../MessagesBox';
import { submitQuery, reshapeReceivedSounds } from '../../utils/fsQuery';
import { readObjectByString } from '../../utils/misc';
import audioLoader from '../../utils/audioLoader';
import tsnejs from '../../vendors/tsne';
import '../../stylesheets/App.scss';
import { DEFAULT_DESCRIPTOR, TSNE_CONFIG, DEFAULT_MAX_RESULTS,
  DEFAULT_MESSAGE_DURATION } from '../../constants';
import '../../polyfills/AudioContext';

const propTypes = {
  windowSize: React.PropTypes.shape({
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
  }),
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      descriptor: DEFAULT_DESCRIPTOR,
      statusMessage: { message: '', status: '' },
      selectedSound: undefined,
      maxResults: DEFAULT_MAX_RESULTS,
      isUserLoggedIn: false,
      isEndUserAuthSupported: false,
      isLoginModalVisible: false,
      isSidebarVisible: true,
      activeMode: 'SearchMode',
    };
    this.onQuerySubmit = this.onQuerySubmit.bind(this);
    this.setMapDescriptor = this.setMapDescriptor.bind(this);
    this.setMaxResults = this.setMaxResults.bind(this);
    this.updateSystemStatusMessage = this.updateSystemStatusMessage.bind(this);
    this.updateSelectedSound = this.updateSelectedSound.bind(this);
    this.setLoginModalVisibility = this.setLoginModalVisibility.bind(this);
    this.setSidebarVisibility = this.setSidebarVisibility.bind(this);
    this.setActiveMode = this.setActiveMode.bind(this);
    this.updateUserLoggedStatus = this.updateUserLoggedStatus.bind(this);
    this.updateEndUserAuthSupport = this.updateEndUserAuthSupport.bind(this);
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleFailedLogin = this.handleFailedLogin.bind(this);
    this.setSessionStorage = this.setSessionStorage.bind(this);
    this.setUpAudioContext();
    this.tsne = undefined;
    this.messageTimer = undefined;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!!this.state.statusMessage.message &&
      this.state.statusMessage.message === nextState.statusMessage.message) {
      // avoid wasted renders due to continuous receiving of same message
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.descriptor !== this.state.descriptor) {
      this.initializeTsne(this.state.sounds);
    }
  }

  onQuerySubmit(query) {
    // first reset the list of sounds in state
    this.setState({
      sounds: [],
      error: '',
      isFetching: true,
    });
    this.updateSystemStatusMessage('Searching for sounds...');
    submitQuery(query, this.state.maxResults).then(
      allPagesResults => this.storeQueryResults(allPagesResults),
      error => this.handleQueryError(error));
  }

  setUpAudioContext() {
    this.audioContext = new window.AudioContext();
    // create a main gain node to set general volume
    this.audioContext.gainNode = this.audioContext.createGain();
    this.audioContext.gainNode.connect(this.audioContext.destination);
    // setup audio engine for loading and playing sounds
    this.audioLoader = audioLoader(this.audioContext);
  }

  setMapDescriptor(evt) {
    const newDescriptor = evt.target.value;
    this.setState({
      descriptor: newDescriptor,
    });
  }

  setSessionStorage(accessToken, userName) {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('username', userName);
  }

  setMaxResults(evt) {
    const newMaxResults = parseInt(evt.target.value, 10);
    this.setState({
      maxResults: newMaxResults,
    });
  }

  setLoginModalVisibility(isLoginModalVisible) {
    this.setState({
      isLoginModalVisible,
    });
  }

  setSidebarVisibility(isSidebarVisible) {
    this.setState({
      isSidebarVisible,
    });
  }

  setActiveMode(activeMode) {
    this.setState({
      activeMode,
    });
    if (!this.state.isSidebarVisible) {
      this.setState({
        isSidebarVisible: true,
      });
    }
  }

  updateUserLoggedStatus(isUserLoggedIn) {
    this.setState({
      isUserLoggedIn,
    });
  }

  updateEndUserAuthSupport(isEndUserAuthSupported) {
    this.setState({
      isEndUserAuthSupported,
    });
  }

  storeQueryResults(allPagesResults) {
    const sounds = reshapeReceivedSounds(allPagesResults);
    // initialize tsne data
    this.initializeTsne(sounds);
    this.setState({
      sounds,
      isFetching: false,
    });
    this.updateSystemStatusMessage(`${sounds.length} sounds loaded, computing map`);
  }

  handleSuccessfulLogin() {
    this.setState({
      isUserLoggedIn: true,
      isLoginModalVisible: false,
    });
    this.updateSystemStatusMessage(`Logged in as ${sessionStorage.getItem('username')}`);
  }

  handleFailedLogin() {
    this.setState({
      isUserLoggedIn: false,
      isLoginModalVisible: false,
    });
    this.updateSystemStatusMessage('Failed to log in...');
  }

  initializeTsne(sounds) {
    if (!sounds) {
      // don't initialize tsne if no sounds provided
      return;
    }
    this.tsne = new tsnejs.Tsne(TSNE_CONFIG);
    const xTsne = [];
    sounds.forEach(sound => {
      const soundFeatureVector = readObjectByString(sound, `analysis.${this.state.descriptor}`);
      xTsne.push(soundFeatureVector);
    });
    this.tsne.initDataRaw(xTsne);
    this.forceUpdate();  // to force render()
  }

  handleQueryError(error) {
    this.updateSystemStatusMessage('No sounds found', 'error');
    this.setState({
      error: error || 'Unexpected error',
      isFetching: false,
    });
  }

  /**
   * Updates the sound for which to show a modal with details
   */
  updateSelectedSound(soundID) {
    this.setState({
      selectedSound: soundID,
    });
  }

  /**
   * Updates the status message in the UI.
   *
   * @param {String} message: the message to be shown
   * @param {String} status: the related icon (info, success, error)
   */
  updateSystemStatusMessage(message, status = 'info', time = DEFAULT_MESSAGE_DURATION) {
    this.setState({
      statusMessage: {
        message,
        status,
      },
    });

    // Clear existing timeouts for hiding the message and set a new one
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(
      () => {
        this.setState({ statusMessage: { message: '', status: '' } });
      }, time
    );
  }

  render() {
    const shouldShowMap = !!this.state.sounds.length;
    return (
      <div className="app-container">
        <Logo />
        <Sidebar
          isVisible={this.state.isSidebarVisible}
          setSidebarVisibility={this.setSidebarVisibility}
          activeMode={this.state.activeMode}
          setActiveMode={this.setActiveMode}
          onQuerySubmit={this.onQuerySubmit}
          onSetMapDescriptor={this.setMapDescriptor}
          onSetMaxResults={this.setMaxResults}
          maxResults={this.state.maxResults}
        />
        <Login
          isLoginModalVisible={this.state.isLoginModalVisible}
          isUserLoggedIn={this.state.isUserLoggedIn}
          isEndUserAuthSupported={this.state.isEndUserAuthSupported}
          setLoginModalVisibility={this.setLoginModalVisibility}
          updateUserLoggedStatus={this.updateUserLoggedStatus}
          updateEndUserAuthSupport={this.updateEndUserAuthSupport}
          setSessionStorage={this.setSessionStorage}
          updateSystemStatusMessage={this.updateSystemStatusMessage}
        />
        {(shouldShowMap) ?
          <Map
            sounds={this.state.sounds}
            tsne={this.tsne}
            audioContext={this.audioContext}
            audioLoader={this.audioLoader}
            updateSystemStatusMessage={this.updateSystemStatusMessage}
            windowSize={this.props.windowSize}
            selectedSound={this.state.selectedSound}
            updateSelectedSound={this.updateSelectedSound}
          /> : ''}
        <MessagesBox statusMessage={this.state.statusMessage} />
      </div>
    );
  }
}

App.propTypes = propTypes;
export default App;
