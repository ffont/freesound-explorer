import React from 'react';
import d3 from 'd3';
import MapCircle from './MapCircle';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM, MAX_TSNE_ITERATIONS } from '../../constants';
import '../../stylesheets/Map.scss';

const propTypes = {
  sounds: React.PropTypes.array,
  tsne: React.PropTypes.object,
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
    const container = d3.select(this.refs.mapContainer);
    const zoom = d3.behavior.zoom()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', this.zoomHandler);
    zoom(container);
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
    const translateX = d3.event.translate[0];
    const translateY = d3.event.translate[1];
    const scale = d3.event.scale;
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
            />
          ))}
        </svg>
      </div>
    );
  }
}

Map.propTypes = propTypes;
export default Map;
