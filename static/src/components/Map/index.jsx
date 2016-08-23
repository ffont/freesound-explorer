import React from 'react';
import { select, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../../actions/messagesBox';
import { updateMapPosition } from '../../actions/map';
import { setIsMidiLearningSoundId } from '../../actions/midi';
import { selectSound } from '../../actions/sounds';
import Space from './Space';
import SpaceTitle from './SpaceTitle';
import SoundInfo from '../SoundInfo';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM } from '../../constants';
import '../../stylesheets/Map.scss';

const propTypes = {
  audioContext: React.PropTypes.object,
  audioLoader: React.PropTypes.object,
  selectedSound: React.PropTypes.number,
  selectSound: React.PropTypes.func,
  playOnHover: React.PropTypes.bool,
  paths: React.PropTypes.array,
  spaces: React.PropTypes.array,
  map: React.PropTypes.shape({
    translateX: React.PropTypes.number,
    translateY: React.PropTypes.number,
    scale: React.PropTypes.number,
  }),
  isUserLoggedIn: React.PropTypes.bool,
  setIsMidiLearningSoundId: React.PropTypes.func,
  isMidiLearningSoundId: React.PropTypes.number,
  midiMappings: React.PropTypes.object,
  updateMapPosition: React.PropTypes.func,
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.zoomHandler = this.zoomHandler.bind(this);
    this.onClickCallback = this.onClickCallback.bind(this);
  }

  componentDidMount() {
    const container = select(this.mapContainer);
    const zoomBehaviour = zoom()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', this.zoomHandler);
    zoomBehaviour(container);
    // disable double click zoom
    container.on('dblclick.zoom', null);
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.map !== this.props.map ||
      nextProps.spaces !== this.props.spaces ||
      nextProps.paths !== this.props.paths);
  }

  onClickCallback(evt) {
    if (evt.target.tagName !== 'circle') {
      // deselect all sounds when not clicking on a circle
      this.props.selectSound();
      // turn off current midi learn
      this.props.setIsMidiLearningSoundId(-1);
    }
  }

  zoomHandler() {
    const translateX = d3Event.transform.x;
    const translateY = d3Event.transform.y;
    const scale = d3Event.transform.k;
    this.props.updateMapPosition({ translateX, translateY, scale });
  }

  render() {
    return (
      <div className="map-container" ref={(mapContainer) => { this.mapContainer = mapContainer; }}>
          {this.props.spaces.map(space =>
            <SpaceTitle key={space.queryID} {...space} mapPosition={this.props.map} />)}
        <svg className="map" onClick={this.onClickCallback}>
          {this.props.spaces.map(space =>
            <Space key={space.queryID} {...space} mapPosition={this.props.map} />)}
        </svg>
        <SoundInfo />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { paths } = state.paths;
  const { spaces } = state.spaces;
  const { map } = state;
  return { paths, spaces, map };
};

Map.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage,
  updateMapPosition,
  setIsMidiLearningSoundId,
  selectSound,
})(Map);
