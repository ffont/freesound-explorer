import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/QueryBox.scss';
import { getSounds } from '../../actions/sounds';
import { updateDescriptor, updateMinDuration, updateMaxDuration,
  updateMaxResults, updateQuery }
  from '../../actions/search';
import { setExampleQueryDone } from '../../actions/sidebar';
import { togglePlayOnHover } from '../../actions/settings';
import { DEFAULT_MAX_RESULTS, DEFAULT_MAX_DURATION, DEFAULT_QUERY } from '../../constants';

const propTypes = {
  maxResults: React.PropTypes.number,
  maxDuration: React.PropTypes.number,
  minDuration: React.PropTypes.number,
  descriptor: React.PropTypes.string,
  query: React.PropTypes.string,
  playOnHover: React.PropTypes.bool,
  togglePlayOnHover: React.PropTypes.func,
  getSounds: React.PropTypes.func,
  sounds: React.PropTypes.object,
  exampleQueryDone: React.PropTypes.bool,
  updateDescriptor: React.PropTypes.func,
  updateMinDuration: React.PropTypes.func,
  updateMaxDuration: React.PropTypes.func,
  updateMaxResults: React.PropTypes.func,
  updateQuery: React.PropTypes.func,
  setExampleQueryDone: React.PropTypes.func,
};

class QueryBox extends React.Component {
  constructor(props) {
    super(props);
    this.submitQuery = this.submitQuery.bind(this);
    this.tryQueryAtMount = this.tryQueryAtMount.bind(this);
  }

  componentDidMount() {
    // query at mount to have the user play with something with no additional interaction
    if (!this.props.exampleQueryDone) {
      this.tryQueryAtMount();
    }
  }

  tryQueryAtMount() {
    if (sessionStorage.getItem('app_token')) {
      this.submitQuery();
      this.props.setExampleQueryDone();
    } else {
      setTimeout(this.tryQueryAtMount, 500);
    }
  }

  submitQuery() {
    let { query } = this.props;
    const { descriptor, maxResults, minDuration, maxDuration } = this.props;
    const queryParams = { descriptor, maxResults, minDuration, maxDuration };
    if (!query.length) {
      query = DEFAULT_QUERY;
    }
    this.props.getSounds(query, queryParams);
  }

  render() {
    return (
      <div id="query-box" className="query-box">
        <form id="query-form" className="query-form">
          <input
            id="query-terms-input"
            className="query-terms-input"
            type="text"
            placeholder="query terms, e.g.: instrument note"
            onChange={(evt) => {
              const query = evt.target.value;
              this.props.updateQuery(query);
            }}
            tabIndex="1"
          />
          <button
            id="search-button"
            className="search-button"
            onClick={(evt) => {
              evt.preventDefault();
              this.submitQuery();
            }}
          >
            <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true" />
          </button>
          <select
            id="map-descriptors-selector"
            className="map-descriptors-selector"
            onChange={(evt) => {
              const descriptor = evt.target.value;
              this.props.updateDescriptor(descriptor);
            }}
          >
            <option value="lowlevel.mfcc.mean">Arrange by Timbre</option>
            <option value="tonal.hpcp.mean">Arrange by Tonality</option>
          </select>
          <div className="slider-wrapper">
            Number of results:
            <input
              id="max-results-slider"
              type="range"
              min="20" max="450" defaultValue={DEFAULT_MAX_RESULTS} step="1"
              onChange={(evt) => {
                const maxResults = evt.target.value;
                this.props.updateMaxResults(maxResults);
              }}
            /><span>{this.props.maxResults}</span>
          </div>
          <div className="slider-wrapper">
            Maximum duration (s):
            <input
              id="max-duration-slider"
              type="range"
              min="0.5" max="30" defaultValue={DEFAULT_MAX_DURATION} step="0.5"
              onChange={(evt) => {
                const maxDuration = evt.target.value;
                this.props.updateMaxDuration(maxDuration);
              }}
            /><span>{this.props.maxDuration}</span>
          </div>
          <div className="toggle-wrapper">
            <span>Play on hover:</span>
            <div style={{ display: 'inline' }}>
              <input
                id="playOnHoverSwitch"
                className={`toggle${(this.props.playOnHover) ? ' active' : ''}`}
                type="checkbox"
                checked={this.props.playOnHover}
                onChange={this.props.togglePlayOnHover}
              />
              <label htmlFor="playOnHoverSwitch" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const sounds = state.sounds.byID;
  const { exampleQueryDone } = state.sidebar;
  return Object.assign({}, { sounds, exampleQueryDone }, state.search, state.settings);
};

QueryBox.propTypes = propTypes;
export default connect(mapStateToProps, {
  getSounds,
  setExampleQueryDone,
  togglePlayOnHover,
  updateDescriptor,
  updateMinDuration,
  updateMaxDuration,
  updateMaxResults,
  updateQuery,
})(QueryBox);
