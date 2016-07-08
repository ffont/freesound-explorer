import React from 'react';
import QueryBox from '../QueryBox';
import Map from '../Map';
import MessagesBox from '../MessagesBox';
import { submitQuery, reshapeReceivedSounds } from '../../utils/fsQuery';
import audioLoader from '../../utils/audioLoader';
import tsnejs from '../../vendors/tsne';
import '../../stylesheets/App.scss';
import { DEFAULT_DESCRIPTOR, TSNE_CONFIG } from '../../constants';
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
    };
    this.onQuerySubmit = this.onQuerySubmit.bind(this);
    this.setMapDescriptor = this.setMapDescriptor.bind(this);
    this.updateSystemStatusMessage = this.updateSystemStatusMessage.bind(this);
    this.setUpAudioContext();
    this.tsne = undefined;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.statusMessage.message === nextState.statusMessage.message) {
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
    submitQuery(query).then(allPagesResults => this.storeQueryResults(allPagesResults),
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

  initializeTsne(sounds) {
    if (!sounds) {
      // don't initialize tsne if no sounds provided
      return;
    }
    this.tsne = new tsnejs.Tsne(TSNE_CONFIG);
    const xTsne = [];
    sounds.forEach(sound => {
      const soundFeatureVector = Object.byString(sound, `analysis.${this.state.descriptor}`);
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
   * Updates the status message in the UI.
   *
   * @param {String} message: the message to be shown
   * @param {String} status: the related icon (info, success, error)
   */
  updateSystemStatusMessage(message, status = 'info') {
    this.setState({
      statusMessage: {
        message,
        status,
      },
    });
  }

  render() {
    const shouldShowMap = !!this.state.sounds.length;
    return (
      <div className="app-container">
        <QueryBox onQuerySubmit={this.onQuerySubmit} onSetMapDescriptor={this.setMapDescriptor} />
        {(shouldShowMap) ?
          <Map
            sounds={this.state.sounds}
            tsne={this.tsne}
            audioContext={this.audioContext}
            audioLoader={this.audioLoader}
            updateSystemStatusMessage={this.updateSystemStatusMessage}
            windowWidth={this.props.windowSize.windowWidth}
            windowHeight={this.props.windowSize.windowHeight}
          /> : ''}
        <MessagesBox statusMessage={this.state.statusMessage} />
      </div>
    );
  }
}

App.propTypes = propTypes;
export default App;
