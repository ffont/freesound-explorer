import React from 'react';
import Map from '../Map';
import Login from '../Login';
import Logo from '../Logo';
import Sidebar from '../Sidebar';
import MessagesBox from '../MessagesBox';
import { submitQuery, reshapeReceivedSounds } from '../../utils/fsQuery';
import { readObjectByString, getRandomElement } from '../../utils/misc';
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
      paths: [],
      descriptor: DEFAULT_DESCRIPTOR,
      statusMessage: { message: '', status: '' },
      selectedSound: undefined,
      maxResults: DEFAULT_MAX_RESULTS,
      isUserLoggedIn: false,
      isEndUserAuthSupported: false,
      isLoginModalVisible: false,
      isSidebarVisible: true,
      activeMode: 'SearchMode',
      playOnHover: false,
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
    this.tooglePlayOnHover = this.tooglePlayOnHover.bind(this);
    this.startStopPlayingPath = this.startStopPlayingPath.bind(this);
    this.createNewPath = this.createNewPath.bind(this);
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
      paths: [],
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

  playSoundByFreesoundId(freesoundId, onEndedCallback) {
    // TODO: check that map is loaded, etc...
    this.refs.map.refs[`map-point-${freesoundId}`].playAudio(onEndedCallback);
  }

  playNextSoundFromPath(pathIndex) {
    const newPaths = this.state.paths;
    const path = newPaths[pathIndex];
    if (path.isPlaying) {
      const freesoundId = path.sounds[path.indexNextToPlay].id;
      path.indexNextToPlay += 1;
      if (path.indexNextToPlay >= path.sounds.length) {
        path.indexNextToPlay = 0;
      }
      newPaths[pathIndex] = path;
      this.setState({
        paths: newPaths,
      });
      this.playSoundByFreesoundId(freesoundId, () => {
        this.playNextSoundFromPath(pathIndex);
      });
    }
  }

  startStopPlayingPath(pathIndex) {
    const newPaths = this.state.paths;
    const path = newPaths[pathIndex];
    path.isPlaying = !path.isPlaying;
    newPaths[pathIndex] = path;
    this.setState({
      paths: newPaths,
    });
    if (path.isPlaying) {
      this.playNextSoundFromPath(pathIndex);
    }
    // Force update map to rerender paths
    this.refs.map.forceUpdate();
  }

  tooglePlayOnHover() {
    this.setState({
      playOnHover: !this.state.playOnHover,
    });
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
    this.updateSystemStatusMessage(`Logged in as ${sessionStorage.getItem('username')}`, 'success');
  }

  handleFailedLogin() {
    this.setState({
      isUserLoggedIn: false,
      isLoginModalVisible: false,
    });
    this.updateSystemStatusMessage('Failed to log in...', 'error');
  }

  createNewPath() {
    // Creates a new random path
    const pathSounds = [];
    const nSounds = Math.floor(Math.random() * (this.state.sounds.length / 4));
    [...Array(nSounds).keys()].map(i => pathSounds.push(getRandomElement(this.state.sounds)));
    const newPath = {
      name: `Random path ${this.state.paths.length + 1}`,
      indexNextToPlay: 0,
      isPlaying: false,
      isSelected: false,
      sounds: pathSounds,
    };
    const newPaths = this.state.paths;
    newPaths.push(newPath);
    this.setState({
      paths: newPaths,
    });
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
          playOnHover={this.state.playOnHover}
          tooglePlayOnHover={this.tooglePlayOnHover}
          paths={this.state.paths}
          startStopPlayingPath={this.startStopPlayingPath}
          createNewPath={this.createNewPath}
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
            ref="map"
            sounds={this.state.sounds}
            tsne={this.tsne}
            audioContext={this.audioContext}
            audioLoader={this.audioLoader}
            updateSystemStatusMessage={this.updateSystemStatusMessage}
            windowSize={this.props.windowSize}
            selectedSound={this.state.selectedSound}
            updateSelectedSound={this.updateSelectedSound}
            playOnHover={this.state.playOnHover}
            paths={this.state.paths}
          /> : ''}
        <MessagesBox statusMessage={this.state.statusMessage} />
      </div>
    );
  }
}

App.propTypes = propTypes;
export default App;
