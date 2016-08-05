import React from 'react';
import { select, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../../actions/messagesBox';
import MapCircle from './MapCircle';
import SoundInfo from '../SoundInfo';
import '../../polyfills/requestAnimationFrame';
import { MIN_ZOOM, MAX_ZOOM, MAX_TSNE_ITERATIONS, MAP_SCALE_FACTOR, DEFAULT_PATH_STROKE_WIDTH,
  DEFAULT_PATH_STROKE_OPACITY, MESSAGE_STATUS } from '../../constants';
import '../../stylesheets/Map.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  sounds: React.PropTypes.array,
  tsne: React.PropTypes.object,
  audioContext: React.PropTypes.object,
  audioLoader: React.PropTypes.object,
  windowSize: React.PropTypes.shape({
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
  }),
  selectedSound: React.PropTypes.number,
  updateSelectedSound: React.PropTypes.func,
  playOnHover: React.PropTypes.bool,
  paths: React.PropTypes.array,
  isUserLoggedIn: React.PropTypes.bool,
  setIsMidiLearningSoundId: React.PropTypes.func,
  isMidiLearningSoundId: React.PropTypes.number,
  midiMappings: React.PropTypes.object,
  displaySystemMessage: React.PropTypes.func,
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.zoomHandler = this.zoomHandler.bind(this);
    this.projectPoint = this.projectPoint.bind(this);
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
      // turn off current midi learn
      this.props.setIsMidiLearningSoundId(-1);
    }
  }

  computeStepSolution() {
    const progress = parseInt(100 * this.currentStepIteration / MAX_TSNE_ITERATIONS, 10);
    const statusMessage =
    `${this.props.sounds.length} sounds loaded, computing map (${progress}%)`;
    this.props.displaySystemMessage(statusMessage, MESSAGE_STATUS.PROGRESS);
    if (this.currentStepIteration < MAX_TSNE_ITERATIONS) {
      this.props.tsne.step();
      this.stepInterval = requestAnimationFrame(() => this.computeStepSolution());
      this.currentStepIteration++;
      // force render with new solution
      this.forceUpdate();
    } else {
      cancelAnimationFrame(this.stepInterval);
      this.props.displaySystemMessage('Map computed!', MESSAGE_STATUS.SUCCESS);
      this.currentStepIteration = 0;
    }
  }

  zoomHandler() {
    const translateX = d3Event.transform.x;
    const translateY = d3Event.transform.y;
    const scale = d3Event.transform.k;
    this.setState({ translateX, translateY, scale });
  }

  projectPoint(positionInTsneSolution) {
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
        <svg className="map" onClick={this.onClickCallback}>
          {'/* Draw circles (sounds)'}
          {this.props.sounds.map((sound, index) => {
            const tsnePosition = {
              x: tsneSolution[index][0],
              y: tsneSolution[index][1],
            };
            const circleRef = `map-point-${sound.id}`;
            const { cx, cy } = this.projectPoint(tsnePosition);
            const isSoundSelected = this.props.selectedSound === sound.id;
            if (isSoundSelected) {
              soundInfoPosition = { x: cx, y: cy };
              soundInfoContent = sound;
            }
            return (
              <MapCircle
                ref={circleRef}
                key={index}
                sound={sound}
                position={{ cx, cy }}
                isSelected={isSoundSelected}
                updateSelectedSound={this.props.updateSelectedSound}
                audioContext={this.props.audioContext}
                audioLoader={this.props.audioLoader}
                playOnHover={this.props.playOnHover}
                projectPoint={this.projectPoint}
                setIsMidiLearningSoundId={this.props.setIsMidiLearningSoundId}
              />
            );
          })}
          {'/* Draw lines (paths) */'}
          {this.props.paths.map((path) => (
            [...Array(path.sounds.length - 1).keys()].map((sound, index) => {
              const soundFrom = path.sounds[index];
              const soundTo = path.sounds[index + 1];
              const indexSoundFrom = this.props.sounds.indexOf(soundFrom);
              const positionFrom = {
                x: tsneSolution[indexSoundFrom][0],
                y: tsneSolution[indexSoundFrom][1],
              };
              const indexSoundTo = this.props.sounds.indexOf(soundTo);
              const positionTo = {
                x: tsneSolution[indexSoundTo][0],
                y: tsneSolution[indexSoundTo][1],
              };
              const { cx: x1, cy: y1 } = this.projectPoint(positionFrom);
              const { cx: x2, cy: y2 } = this.projectPoint(positionTo);
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="white"
                  strokeWidth={DEFAULT_PATH_STROKE_WIDTH}
                  strokeOpacity={(path.isPlaying) ?
                    DEFAULT_PATH_STROKE_OPACITY * 10 :
                    DEFAULT_PATH_STROKE_OPACITY}
                />
              );
            })
          ))}
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

Map.propTypes = propTypes;
export default connect(() => ({}), { displaySystemMessage })(Map);
