import React from 'react';
import '../../stylesheets/QueryBox.scss';
import '../../stylesheets/toggle.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { DEFAULT_MAX_RESULTS } from '../../constants';

const propTypes = {
  onSetMapDescriptor: React.PropTypes.func,
  onSetMaxResults: React.PropTypes.func,
  onQuerySubmit: React.PropTypes.func,
  maxResults: React.PropTypes.number,
  playOnHover: React.PropTypes.bool,
  tooglePlayOnHover: React.PropTypes.func,
};

class QueryBox extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
            ref="query"
          />
          <button
            id="search-button"
            className="search-button"
            onClick={(evt) => {
              evt.preventDefault();
              this.props.onQuerySubmit(this.refs.query.value);
            }}
          >
            <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true" />
          </button>
          <select
            id="map-descriptors-selector"
            className="map-descriptors-selector"
            onChange={this.props.onSetMapDescriptor}
          >
            <option value="lowlevel.mfcc.mean">Arrange by Timbre</option>
            <option value="tonal.hpcp.mean">Arrange by Tonality</option>
          </select>
          <input
            id="max-results-slider"
            className="max-results-slider"
            type="range" onChange={this.props.onSetMaxResults}
            min="20" max="450" defaultValue={DEFAULT_MAX_RESULTS} step="1"
          /><span>{this.props.maxResults}</span>
          <div className="toggle-wrapper">
            <span>Play on hover:</span>
            <div style={{ display: 'inline' }}>
              <input
                id="playOnHoverSwitch"
                className={`toggle${(this.props.playOnHover) ? ' active' : ''}`}
                type="checkbox"
                checked={this.props.playOnHover}
                onChange={this.props.tooglePlayOnHover}
              />
              <label htmlFor="playOnHoverSwitch"></label>
            </div>
          </div>
        </form>
      </div>
    );
  }
}


QueryBox.propTypes = propTypes;
export default QueryBox;
