import React from 'react';
import QueryBox from '../QueryBox';
import Map from '../Map';
import { submitQuery, reshapeReceivedSounds } from '../../fsQuery';
import tsnejs from '../../vendors/tsne';
import '../../stylesheets/App.scss';
import { DEFAULT_DESCRIPTOR, TSNE_CONFIG } from '../../constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sounds: [], descriptor: DEFAULT_DESCRIPTOR };
    this.onQuerySubmit = this.onQuerySubmit.bind(this);
    this.setMapDescriptor = this.setMapDescriptor.bind(this);
    this.tsne = new tsnejs.Tsne(TSNE_CONFIG);
  }

  onQuerySubmit(query) {
    // first reset the list of sounds in state
    this.setState({
      sounds: [],
      error: '',
      isFetching: true,
    });
    submitQuery(query).then(allPagesResults => this.storeQueryResults(allPagesResults),
      error => this.handleQueryError(error));
  }

  setMapDescriptor(evt) {
    const newDescriptor = evt.target.value;
    this.setState({
      descriptor: newDescriptor,
    });
  }

  storeQueryResults(allPagesResults) {
    const sounds = reshapeReceivedSounds(allPagesResults);
    // create a tSNE instance
    const xTsne = [];
    sounds.forEach(sound => {
      const soundFeatureVector = Object.byString(sound, `analysis.${this.state.descriptor}`);
      xTsne.push(soundFeatureVector);
    });
    this.tsne.initDataRaw(xTsne);
    this.setState({
      sounds,
      isFetching: false,
    });
  }

  handleQueryError(error) {
    this.setState({
      error: error || 'Unexpected error',
      isFetching: false,
    });
  }

  render() {
    const shouldShowMap = !!this.state.sounds.length;
    return (
      <div className="app-container">
        <QueryBox onQuerySubmit={this.onQuerySubmit} onSetMapDescriptor={this.setMapDescriptor} />
        {(shouldShowMap) ? <Map sounds={this.state.sounds} tsne={this.tsne} /> : ''}
      </div>
    );
  }
}

export default App;
