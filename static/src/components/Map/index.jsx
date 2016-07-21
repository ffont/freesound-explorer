import React from 'react';
import { select, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import MapCircle from './MapCircle';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM, MAX_TSNE_ITERATIONS } from '../../constants';
import '../../stylesheets/Map.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  sounds: React.PropTypes.array,
  tsne: React.PropTypes.object,
  audioContext: React.PropTypes.object,
  audioLoader: React.PropTypes.object,
  updateSystemStatusMessage: React.PropTypes.func,
  windowSize: React.PropTypes.shape({
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
  }),
  selectedSound: React.PropTypes.number,
  updateSelectedSound: React.PropTypes.func,
  playOnHover: React.PropTypes.bool,
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.zoomHandler = this.zoomHandler.bind(this);
    this.stepInterval = undefined;
    this.state = ({
      translateX: 0,
      translateY: 0,
      scale: 1,
    });
    this.currentStepIteration = 0;
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClickCallback = this.onClickCallback.bind(this);
  }

  componentDidMount() {
    const container = select(this.refs.mapContainer);
    const zoomBehaviour = zoom()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', this.zoomHandler);
    zoomBehaviour(container);
    // disable double click zoom
    container.on('dblclick.zoom', null);
    this.computeStepSolution();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tsne !== this.props.tsne) {
      this.computeStepSolution();
    }
  }

  onClickCallback(evt) {
    if (evt.target.tagName !== 'circle') {
      // deselect all sounds when not clicking on a circle
      this.props.updateSelectedSound();
    }
  }

  computeStepSolution() {
    const progress = parseInt(100 * this.currentStepIteration / MAX_TSNE_ITERATIONS, 10);
    const statusMessage =
    `${this.props.sounds.length} sounds loaded, computing map (${progress}%)`;
    this.props.updateSystemStatusMessage(statusMessage);
    if (this.currentStepIteration < MAX_TSNE_ITERATIONS) {
      this.props.tsne.step();
      this.stepInterval = requestAnimationFrame(() => this.computeStepSolution());
      this.currentStepIteration++;
      // force render with new solution
      this.forceUpdate();
    } else {
      cancelAnimationFrame(this.stepInterval);
      this.props.updateSystemStatusMessage('Map computed!', 'success');
      // hide system status message after 5 seconds
      // setTimeout(() => this.props.updateSystemStatusMessage(''), 5000);
      this.currentStepIteration = 0;
    }
  }

  zoomHandler() {
    const translateX = d3Event.transform.x;
    const translateY = d3Event.transform.y;
    const scale = d3Event.transform.k;
    this.setState({ translateX, translateY, scale });
  }

  render() {
    const { translateX, translateY, scale } = this.state;
    const mapZoom = { translateX, translateY, scale };
    const tsneSolution = this.props.tsne.getSolution();
    return (
      <div className="map-container" ref="mapContainer">
        <svg ref="map" className="map" onClick={this.onClickCallback}>
          {this.props.sounds.map((sound, index) => {
            const circlePosition = {
              x: tsneSolution[index][0],
              y: tsneSolution[index][1],
            };
            return (
              <MapCircle
                key={index}
                sound={sound}
                mapZoom={mapZoom}
                positionInTsneSolution={circlePosition}
                isSelected={this.props.selectedSound === sound.id}
                updateSelectedSound={this.props.updateSelectedSound}
                windowSize={this.props.windowSize}
                audioContext={this.props.audioContext}
                audioLoader={this.props.audioLoader}
                playOnHover={this.props.playOnHover}
              />
            );
          })}
        </svg>
      </div>
    );
  }
}

Map.propTypes = propTypes;
export default Map;
