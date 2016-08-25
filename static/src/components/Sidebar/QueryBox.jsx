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
import InputTextButton from '../Input/InputTextButton';
import SelectWithLabel from '../Input/SelectWithLabel';
import SliderRange from '../Input/SliderRange';

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
      <form id="query-form" className="query-form">
        <InputTextButton
          onTextChange={(evt) => {
            const query = evt.target.value;
            this.props.updateQuery(query);
          }}
          tabIndex="1"
          placeholder="query terms, e.g.: instrument note"
          onButtonClick={(evt) => {
            evt.preventDefault();
            this.submitQuery();
          }}
          buttonIcon="fa fa-search fa-lg"
        />
        <SelectWithLabel
          onChange={(evt) => {
            const descriptor = evt.target.value;
            this.props.updateDescriptor(descriptor);
          }}
          options={[{ option: 'lowlevel.mfcc.mean', name: 'Timbre' },
            { option: 'tonal.hpcp.mean', name: 'Tonality' }]}
          label="Arrange by"
        />
        <SliderRange
          label="Number of results"
          minValue="20"
          maxValue="450"
          defaultValue={this.props.maxResults}
          onChange={(evt) => {
            const maxResults = evt.target.value;
            this.props.updateMaxResults(maxResults);
          }}
          currentValue={this.props.maxResults}
        />
        <SliderRange
          label="Maximum duration"
          minValue="0.5"
          maxValue="30"
          defaultValue={this.props.maxDuration}
          step="0.5"
          onChange={(evt) => {
            const maxDuration = evt.target.value;
            this.props.updateMaxDuration(maxDuration);
          }}
          currentValue={this.props.maxDuration}
        />
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
