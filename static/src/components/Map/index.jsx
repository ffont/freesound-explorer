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
  windowWidth: React.PropTypes.number,
  windowHeight: React.PropTypes.number,
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
      currentStepIteration: 0,
    });
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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

  computeStepSolution() {
    const progress = parseInt(100 * this.state.currentStepIteration / MAX_TSNE_ITERATIONS, 10);
    const statusMessage =
    `${this.props.sounds.length} sounds loaded, computing map (${progress}%)`;
    this.props.updateSystemStatusMessage(statusMessage);
    if (this.state.currentStepIteration < MAX_TSNE_ITERATIONS) {
      this.props.tsne.step();
      this.stepInterval = requestAnimationFrame(() => this.computeStepSolution());
      // update state in order to force re-render and automatically update displayed map
      this.setState({
        currentStepIteration: this.state.currentStepIteration + 1,
      });
    } else {
      cancelAnimationFrame(this.stepInterval);
      this.props.updateSystemStatusMessage('Map computed!', 'success');
      // hide system status message after 5 seconds
      setTimeout(() => this.props.updateSystemStatusMessage(''), 5000);
      this.setState({
        currentStepIteration: 0,
      });
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
    const tsneSolution = this.props.tsne.getSolution();
    return (
      <div className="map-container" ref="mapContainer">
        <svg ref="map" className="map">
          {this.props.sounds.map((sound, index) => (
            <MapCircle
              key={sound.id}
              sound={sound}
              translateX={translateX}
              translateY={translateY}
              scale={scale}
              positionInTsneSolution={tsneSolution[index]}
              windowWidth={this.props.windowWidth}
              windowHeight={this.props.windowHeight}
              audioContext={this.props.audioContext}
              audioLoader={this.props.audioLoader}
            />
          ))}
        </svg>
      </div>
    );
  }
}

Map.propTypes = propTypes;
export default Map;
