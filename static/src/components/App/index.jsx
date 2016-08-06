import React from 'react';
import AudioTickListener from './AudioTickListener';
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
import '../../stylesheets/toggle.scss';
import '../../stylesheets/slider.scss';
import '../../stylesheets/button.scss';
import { DEFAULT_DESCRIPTOR, TSNE_CONFIG, DEFAULT_MAX_RESULTS, MESSAGE_STATUS }
  from '../../constants';
import '../../polyfills/AudioContext';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../../actions';


const propTypes = {
  windowSize: React.PropTypes.shape({
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
  }),
  displaySystemMessage: React.PropTypes.func,
  paths: React.PropTypes.array,
};


class App extends AudioTickListener {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      midiMappings: undefined,
      isMidiLearningSoundId: -1,
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
    this.setPathSyncMode = this.setPathSyncMode.bind(this);
    this.playRandomSound = this.playRandomSound.bind(this);
    this.setIsMidiLearningSoundId = this.setIsMidiLearningSoundId.bind(this);
    this.setUpAudioContext();
    this.tsne = undefined;
  }

  componentDidMount() {
    super.componentDidMount()
    this.setUpMIDIDevices();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!!this.state.statusMessage.message &&
      this.state.statusMessage.status === MESSAGE_STATUS.PROGRESS &&
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
    this.props.displaySystemMessage('Searching for sounds...');
    submitQuery(query, this.state.maxResults).then(
      allPagesResults => this.storeQueryResults(allPagesResults),
      error => this.handleQueryError(error));
  }

  handleNoteOn(note, velocity) {
    // Find closest note with assigned sound and play with adjusted playback rate
    const closestNote = Object.keys(this.state.midiMappings.notes).reduce((prev, curr) =>
      (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
    const soundId = this.state.midiMappings.notes[closestNote];
    const semitonesDelta = note - closestNote;
    const playBackRate = Math.pow(2, (semitonesDelta / 12));
    const sourceNodeKey = `node_${note}`;
    if (soundId) {
      if (velocity > 0) {  // Some midi sources implement noteoff with velocity = 0
        this.playSoundByFreesoundId(soundId, undefined, playBackRate, sourceNodeKey);
      } else {
        this.handleNoteOff(note);
      }
    }
  }

  handleNoteOff(note) {
    const closestNote = Object.keys(this.state.midiMappings.notes).reduce((prev, curr) =>
      (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
    const soundId = this.state.midiMappings.notes[closestNote];
    const sourceNodeKey = `node_${note}`;
    this.stopSoundByFreesoundId(soundId, sourceNodeKey);
  }

  onMIDIMessage(message) {
    const type = message.data[0] & 0xf0;
    const note = message.data[1];
    const velocity = message.data[2];
    switch (type) {
      case 144: { // noteOn message
        if (this.state.isMidiLearningSoundId > -1) {
          this.state.midiMappings.notes[note] = this.state.isMidiLearningSoundId;
          this.setIsMidiLearningSoundId(-1);
        } else {
          if (Object.keys(this.state.midiMappings.notes).length > 0) {
            // Only handle message if mappings exist
            this.handleNoteOn(note, velocity);
          }
        }
        break;
      }
      case 128: { // noteOff message
        if (Object.keys(this.state.midiMappings.notes).length > 0) {
          // Only handle message if mappings exist
          this.handleNoteOff(note);
        }
        break;
      }
      default:
        break;
    }
  }

  setUpAudioContext() {
    this.audioContext = new window.AudioContext();
    // create a main gain node to set general volume
    this.audioContext.gainNode = this.audioContext.createGain();
    this.audioContext.gainNode.connect(this.audioContext.destination);
    // setup audio engine for loading and playing sounds
    this.audioLoader = audioLoader(this.audioContext);
  }

  setUpMIDIDevices() {
    if (window.navigator.requestMIDIAccess) {
      window.navigator.requestMIDIAccess().then(
        (midiAccess) => {
          this.state.midiMappings = { notes: {} };
          const inputs = midiAccess.inputs.values();
          // Iterate over all existing MIDI devices and connect them to onMIDIMessage
          for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = (data) => this.onMIDIMessage(data);
          }
        }, () => this.props.displaySystemMessage('No MIDI support...', 'error')
      );
    } else {
      this.props.displaySystemMessage('No MIDI support in your browser...', 'error');
    }
  }

  setMapDescriptor(evt) {
    const newDescriptor = evt.target.value;
    this.setState({
      descriptor: newDescriptor,
    });
  }

  setIsMidiLearningSoundId(isMidiLearningSoundId) {
    this.setState({
      isMidiLearningSoundId,
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

  playSoundByFreesoundId(freesoundId, onEndedCallback, playbackRate = 1.0, sourceNodeKey, time) {
    // TODO: check that map is loaded, etc...
    this.refs.map.getWrappedInstance().refs[`map-point-${freesoundId}`].playAudio(
      onEndedCallback, playbackRate, sourceNodeKey, time);
  }

  playRandomSound() {
    const sound = getRandomElement(this.state.sounds);
    this.playSoundByFreesoundId(sound.id);
  }

  stopSoundByFreesoundId(freesoundId, sourceNodeKey) {
    // TODO: check that map is loaded, etc...
    this.refs.map.getWrappedInstance().refs[`map-point-${freesoundId}`].stopAudio(sourceNodeKey);
  }

  onAudioTick(bar, beat, tick, time) {
    for (let i = 0; i < this.props.paths.length; i++) {
      if (this.props.paths[i].isPlaying) {
        if (this.props.paths[i].syncMode === 'beat') {
          if (tick % 4 === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(i, time);
              }
            }
          }
        }
        if (this.props.paths[i].syncMode === 'bar') {
          if (tick === 0) {
            if (this.props.paths[i].currentlyPlaying.willFinishAt === undefined) {
              this.playNextSoundFromPath(i, time);
            } else {
              if (this.props.paths[i].currentlyPlaying.willFinishAt <= time) {
                this.playNextSoundFromPath(i, time);
              }
            }
          }
        }
      }
    }
  }

  playNextSoundFromPath(pathIndex, time) {
    const newPaths = this.props.paths;
    const path = newPaths[pathIndex];
    if (path.isPlaying) {
      let nextSoundToPlayIdx;
      if ((path.currentlyPlaying.soundIdx === undefined) ||
        (path.currentlyPlaying.soundIdx + 1 >= path.sounds.length)) {
        nextSoundToPlayIdx = 0;
      } else {
        nextSoundToPlayIdx = path.currentlyPlaying.soundIdx + 1;
      }
      const nextSoundToPlay = path.sounds[nextSoundToPlayIdx];
      const currentTime = this.audioContext.currentTime;
      path.currentlyPlaying = {
        soundIdx: nextSoundToPlayIdx,
        willFinishAt: (time === undefined) ?
          currentTime + nextSoundToPlay.duration : time + nextSoundToPlay.duration,
      };
      newPaths[pathIndex] = path;
      this.setState({
        paths: newPaths,
      });
      if (path.syncMode === 'no') {
        this.playSoundByFreesoundId(nextSoundToPlay.id, () => {
          this.playNextSoundFromPath(pathIndex);
        });
      } else {
        // If synched to metronome, sounds will be triggered by onAudioTick events
        if (time !== undefined) {
          this.playSoundByFreesoundId(
            path.sounds[nextSoundToPlayIdx].id, undefined, undefined, undefined, time);
        }
      }
    }
  }

  startStopPlayingPath(pathIndex) {
    const newPaths = this.props.paths;
    const path = newPaths[pathIndex];
    path.isPlaying = !path.isPlaying;
    path.isSelected = path.isPlaying;  // TODO: select on click not on play
    if (!path.isPlaying) {
      path.currentlyPlaying = {
        soundIdx: undefined,
        willFinishAt: undefined,
      };
    }
    newPaths[pathIndex] = path;
    this.setState({
      paths: newPaths,
    });
    if (path.isPlaying) {
      this.playNextSoundFromPath(pathIndex);
    }
    // Force update map to rerender paths
    this.refs.map.getWrappedInstance().forceUpdate();
  }

  setPathSyncMode(pathIndex, newMode) {
    const path = this.props.paths[pathIndex];
    path.syncMode = newMode;
    const newPaths = this.props.paths;
    newPaths[pathIndex] = path;
    this.setState({
      paths: newPaths,
    });
    if (newMode === 'no') {
      if (path.isPlaying) {
        if (path.currentlyPlaying.willFinishAt === undefined) {
          this.playNextSoundFromPath(pathIndex);
        } else {
          this.playNextSoundFromPath(pathIndex, path.currentlyPlaying.willFinishAt);
        }
      }
    }
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
    this.props.displaySystemMessage(`${sounds.length} sounds loaded, computing map`);
  }

  handleSuccessfulLogin() {
    this.setState({
      isUserLoggedIn: true,
      isLoginModalVisible: false,
    });
    this.props.displaySystemMessage(`Logged in as ${sessionStorage.getItem('username')}`,
      MESSAGE_STATUS.SUCCESS);
  }

  handleFailedLogin() {
    this.setState({
      isUserLoggedIn: false,
      isLoginModalVisible: false,
    });
    this.props.displaySystemMessage('Failed to log in...', MESSAGE_STATUS.ERROR);
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

    // Reset midiMappings
    this.state.midiMappings = { notes: {} };
  }

  handleQueryError(error) {
    this.props.displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR);
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

  render() {
    const shouldShowMap = !!this.state.sounds.length;
    return (
      <div className="app-container">
        <Logo />
        <Sidebar
          sounds={this.state.sounds}
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
          paths={this.props.paths}
          startStopPlayingPath={this.startStopPlayingPath}
          updateSelectedSound={this.updateSelectedSound}
          audioContext={this.audioContext}
        />
        <Login
          isLoginModalVisible={this.state.isLoginModalVisible}
          isUserLoggedIn={this.state.isUserLoggedIn}
          isEndUserAuthSupported={this.state.isEndUserAuthSupported}
          setLoginModalVisibility={this.setLoginModalVisibility}
          updateUserLoggedStatus={this.updateUserLoggedStatus}
          updateEndUserAuthSupport={this.updateEndUserAuthSupport}
          setSessionStorage={this.setSessionStorage}
        />
        {(shouldShowMap) ?
          <Map
            ref="map"
            sounds={this.state.sounds}
            tsne={this.tsne}
            audioContext={this.audioContext}
            audioLoader={this.audioLoader}
            windowSize={this.props.windowSize}
            selectedSound={this.state.selectedSound}
            updateSelectedSound={this.updateSelectedSound}
            playOnHover={this.state.playOnHover}
            paths={this.props.paths}
            isUserLoggedIn={this.state.isUserLoggedIn}
            setIsMidiLearningSoundId={this.setIsMidiLearningSoundId}
            isMidiLearningSoundId={this.state.isMidiLearningSoundId}
            midiMappings={this.state.midiMappings}
          /> : ''}
        <MessagesBox statusMessage={this.state.statusMessage} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { paths } = state.paths;
  return { paths };
};

App.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage,
})(App);
