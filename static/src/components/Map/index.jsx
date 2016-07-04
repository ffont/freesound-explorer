import React from 'react';
import { select, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import MapCircle from './MapCircle';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM, MAX_TSNE_ITERATIONS } from '../../constants';
import '../../stylesheets/Map.scss';

const propTypes = {
  sounds: React.PropTypes.array,
  tsne: React.PropTypes.object,
  audioContext: React.PropTypes.object,
  audioEngine: React.PropTypes.object,
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

  computeStepSolution() {
    // update state in order to force re-render and automatically update displayed map
    this.setState({
      currentStepIteration: this.state.currentStepIteration + 1,
    });
    if (this.state.currentStepIteration < MAX_TSNE_ITERATIONS) {
      this.props.tsne.step();
      this.stepInterval = requestAnimationFrame(() => this.computeStepSolution());
    } else {
      cancelAnimationFrame(this.stepInterval);
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
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
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
              windowWidth={windowWidth}
              windowHeight={windowHeight}
              audioContext={this.props.audioContext}
              audioEngine={this.props.audioEngine}
            />
          ))}
        </svg>
      </div>
    );
  }
}

Map.propTypes = propTypes;
export default Map;
