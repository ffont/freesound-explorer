import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PERFORM_QUERY_AT_MOUNT } from 'constants';
import InputTextButton from 'components/Input/InputTextButton';
import SelectWithLabel from 'components/Input/SelectWithLabel';
import SliderRange from 'components/Input/SliderRange';
import { debounce } from 'lodash';
import { updateSorting, updateDescriptor, updateMinDuration, updateMaxDuration,
  updateMaxResults, updateQuery }
  from './actions';
import { getSounds, getResultsCount } from '../Sounds/actions';
import { setExampleQueryDone } from '../Sidebar/actions';
import { randomQuery } from '../../utils/randomUtils';


const propTypes = {
  maxResults: PropTypes.number,
  maxDuration: PropTypes.number,
  minDuration: PropTypes.number,
  sorting: PropTypes.string,
  query: PropTypes.string,
  descriptor: PropTypes.string,
  getSounds: PropTypes.func,
  getResultsCount: PropTypes.func,
  isExampleQueryDone: PropTypes.bool,
  updateSorting: PropTypes.func,
  updateDescriptor: PropTypes.func,
  updateMinDuration: PropTypes.func,
  updateMaxDuration: PropTypes.func,
  updateMaxResults: PropTypes.func,
  updateQuery: PropTypes.func,
  setExampleQueryDone: PropTypes.func,
};

class QueryBox extends React.Component {
  constructor(props) {
    super(props);
    this.submitQuery = this.submitQuery.bind(this);
    this.tryQueryAtMount = this.tryQueryAtMount.bind(this);
  }

  componentWillMount() {
    // prevents too many requests to FS server
    this._debouncedResultsCount = debounce(this.props.getResultsCount.bind(this), 400, {
      leading: false,
      trailing: true,
    });
  }

  componentDidMount() {
    if (PERFORM_QUERY_AT_MOUNT) {
      // query at mount to have the user play with something with no additional interaction
      if (!this.props.isExampleQueryDone) {
        this.tryQueryAtMount();
      }
    }
  }

  tryQueryAtMount() {
    if (sessionStorage.getItem('appToken')) {
      this.submitQuery();
      this.props.setExampleQueryDone();
    } else {
      setTimeout(this.tryQueryAtMount, 500);
    }
  }

  submitQuery() {
    let { query } = this.props;
    const { sorting, descriptor, maxResults, minDuration, maxDuration } = this.props;
    const queryParams = { sorting, descriptor, maxResults, minDuration, maxDuration };
    if (!query.length) {
      query = randomQuery();
    }
    this.props.getSounds(query, queryParams);
  }

  render() {
    return (
      <form
        id="query-form"
        className="QueryForm"
        onSubmit={(evt) => {
          evt.preventDefault();
          this.submitQuery();
        }}
      >
        <InputTextButton
          onTextChange={(evt) => {
            const query = evt.target.value;
            this.props.updateQuery(query);
            // makes a reqest to freesound for each keystroke to get number of possible results
            this._debouncedResultsCount(query);
          }}
          currentValue={this.props.query}
          tabIndex="0"
          placeholder="query terms, e.g.: instruments"
          buttonIcon="fa fa-search fa-lg"
        />
        <SelectWithLabel
          onChange={(evt) => {
            const descriptor = evt.target.value;
            this.props.updateDescriptor(descriptor);
          }}
          options={[{ value: 'lowlevel.mfcc.mean', name: 'Timbre' },
            { value: 'tonal.hpcp.mean', name: 'Tonality' }]}
          label="Arrange by"
          tabIndex="0"
          defaultValue={this.props.descriptor}
        />
        <SelectWithLabel
          onChange={(evt) => {
            const sorting = evt.target.value;
            this.props.updateSorting(sorting);
          }}
          options={[
            { value: 'score', name: 'Relevance' },
            { value: 'rating_desc', name: 'Rating' },
            { value: 'duration_desc', name: 'Duration' },
            { value: 'downloads_desc', name: 'Downloads' },
            { value: 'creation_desc', name: 'Creation Date (newest first)' },
            { value: 'creation_asc', name: 'Creation Date (oldest first)' },
          ]}
          label="Sort by"
          tabIndex="0"
          defaultValue={this.props.sorting}
        />
        <SliderRange
          label="Number of results"
          minValue="20"
          maxValue="450"
          onChange={(evt) => {
            const maxResults = evt.target.value;
            this.props.updateMaxResults(maxResults);
          }}
          currentValue={this.props.maxResults}
          tabIndex="0"
          id="max-results-slider"
        />
        <SliderRange
          label="Maximum duration"
          minValue="0.5"
          maxValue="30"
          step="0.5"
          onChange={(evt) => {
            const maxDuration = evt.target.value;
            this.props.updateMaxDuration(maxDuration);
          }}
          currentValue={this.props.maxDuration}
          tabIndex="0"
          id="max-duration-slider"
        />
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const { isExampleQueryDone } = state.sidebar;
  return Object.assign({}, { isExampleQueryDone }, state.search);
};

QueryBox.propTypes = propTypes;
export default connect(mapStateToProps, {
  getSounds,
  getResultsCount,
  setExampleQueryDone,
  updateDescriptor,
  updateSorting,
  updateMinDuration,
  updateMaxDuration,
  updateMaxResults,
  updateQuery,
})(QueryBox);
