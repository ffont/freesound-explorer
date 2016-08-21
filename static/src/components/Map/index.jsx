import React from 'react';
import { select, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../../actions/messagesBox';
import { updateMapPosition } from '../../actions/map';
import Space from './Space';
import SoundInfo from '../SoundInfo';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM } from '../../constants';
import '../../stylesheets/Map.scss';

const propTypes = {
  audioContext: React.PropTypes.object,
  audioLoader: React.PropTypes.object,
  selectedSound: React.PropTypes.number,
  updateSelectedSound: React.PropTypes.func,
  playOnHover: React.PropTypes.bool,
  paths: React.PropTypes.array,
  spaces: React.PropTypes.array,
  position: React.PropTypes.shape({
    translateX: React.PropTypes.number,
    translateY: React.PropTypes.number,
    scale: React.PropTypes.number,
  }),
  isUserLoggedIn: React.PropTypes.bool,
  setIsMidiLearningSoundId: React.PropTypes.func,
  isMidiLearningSoundId: React.PropTypes.number,
  midiMappings: React.PropTypes.object,
  displaySystemMessage: React.PropTypes.func,
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

  onClickCallback(evt) {
    if (evt.target.tagName !== 'circle') {
      // deselect all sounds when not clicking on a circle
      this.props.updateSelectedSound();
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
    let soundInfoPosition;
    let soundInfoContent;
    return (
      <div className="map-container" ref={(mapContainer) => { this.mapContainer = mapContainer; }}>
        <svg className="map" onClick={this.onClickCallback}>
          {this.props.spaces.map(space => <Space key={space.queryID} {...space} />)}
        </svg>
        <SoundInfo
          position={soundInfoPosition}
          sound={soundInfoContent}
          isUserLoggedIn={this.props.isUserLoggedIn}
          updateSystemStatusMessage={this.props.displaySystemMessage}
          setIsMidiLearningSoundId={this.props.setIsMidiLearningSoundId}
          isMidiLearningSoundId={this.props.isMidiLearningSoundId}
          midiMappings={this.props.midiMappings}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { paths } = state.paths;
  const { spaces } = state.spaces;
  const position = state.map;
  return { paths, position, spaces };
};

Map.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage,
  updateMapPosition,
}, undefined, { withRef: true })(Map);
