import React from 'react';
import { select, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import MapCircle from './MapCircle';
import SoundInfo from '../SoundInfo';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM, MAX_TSNE_ITERATIONS, MAP_SCALE_FACTOR } from '../../constants';
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
      setTimeout(() => this.props.updateSystemStatusMessage(''), 5000);
      this.currentStepIteration = 0;
    }
  }

  zoomHandler() {
    const translateX = d3Event.transform.x;
    const translateY = d3Event.transform.y;
    const scale = d3Event.transform.k;
    this.setState({ translateX, translateY, scale });
  }

  computeCirclePosition(positionInTsneSolution) {
    const { windowWidth, windowHeight } = this.props.windowSize;
    const { translateX, translateY, scale } = this.state;
    const cx = (positionInTsneSolution.x +
      (windowWidth / (MAP_SCALE_FACTOR * 2))) *
      MAP_SCALE_FACTOR * scale + translateX;
    const cy = (positionInTsneSolution.y +
      (windowHeight / (MAP_SCALE_FACTOR * 2))) *
      MAP_SCALE_FACTOR * scale + translateY;
    return { cx, cy };
  }

  render() {
    const tsneSolution = this.props.tsne.getSolution();
    let soundInfoPosition;
    let soundInfoContent;
    return (
      <div className="map-container" ref="mapContainer">
        <svg ref="map" className="map" onClick={this.onClickCallback}>
          {this.props.sounds.map((sound, index) => {
            const tsnePosition = {
              x: tsneSolution[index][0],
              y: tsneSolution[index][1],
            };
            const { cx, cy } = this.computeCirclePosition(tsnePosition);
            const isSoundSelected = this.props.selectedSound === sound.id;
            if (isSoundSelected) {
              soundInfoPosition = { x: cx, y: cy };
              soundInfoContent = sound;
            }
            return (
              <MapCircle
                key={index}
                sound={sound}
                position={{ cx, cy }}
                isSelected={this.props.selectedSound === sound.id}
                updateSelectedSound={this.props.updateSelectedSound}
                audioContext={this.props.audioContext}
                audioLoader={this.props.audioLoader}
              />
            );
          })}
        </svg>
        <SoundInfo position={soundInfoPosition} sound={soundInfoContent} />
      </div>
    );
  }
}

Map.propTypes = propTypes;
export default Map;
