import React from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import '../../stylesheets/Waveform.scss';
import sassVariables from 'json!../../stylesheets/variables.json';
import { downsampleSignal } from '../../utils/misc';
import { lighten } from '../../utils/colors';
import { PIXELS_PER_SECOND, POINTS_PER_SECOND } from '../../constants';


const propTypes = {
  sound: React.PropTypes.object,
  loadSoundByFreesoundId: React.PropTypes.func,
  useProportionalWidth: React.PropTypes.bool,
};

const buildSymmetricSignal = (signal) => signal.reduce((symmetricSignal, curVal) =>
  [...symmetricSignal, curVal, -curVal], []);

class Waveform extends React.Component {
  componentDidMount() {
    this.handleComponentUpdate();
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.sound && !nextProps.sound) {
      return false;
    }
    if (this.props.sound === nextProps.sound &&
      this.props.sound.buffer === nextProps.sound.buffer) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    this.handleComponentUpdate();
  }

  handleComponentUpdate() {
    if (!this.props.sound) {
      return;
    }
    if (!this.props.sound.buffer) {
      this.props.loadSoundByFreesoundId(this.props.sound.id, () => {
        this.handleComponentUpdate();
        this.forceUpdate();
      });
      return;
    }
    const signal = this.props.sound.buffer.getChannelData(0);
    const numberOfPoints = (this.props.useProportionalWidth) ?
      parseInt(POINTS_PER_SECOND * this.props.sound.duration, 10) : undefined;
    const downsampledSignal = downsampleSignal(signal, numberOfPoints);
    const symmetricSignal = buildSymmetricSignal(downsampledSignal);
    let { waveformWidth, waveformHeight } = sassVariables;
    if (this.props.useProportionalWidth) {
      waveformWidth = parseInt(PIXELS_PER_SECOND * this.props.sound.duration, 10);
    }
    this.drawWaveForm(symmetricSignal, waveformWidth, waveformHeight);
  }

  drawWaveForm(signal, waveformWidth, waveformHeight) {
    const svg = select(this.refs.waveform);
    svg.selectAll('*').remove();
    const width = parseInt(waveformWidth, 10);
    const height = parseInt(waveformHeight, 10);
    const xScale = scaleBand()
      .range([0, width])
      .padding(0.3);
    xScale.domain(signal.map((val, index) => index));
    const yMax = Math.max.apply(null, signal.map(Math.abs));
    const yScale = scaleLinear()
      .range([0, height / 2])
      .domain([0, yMax]);
    svg.selectAll('.bar')
      .data(signal)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (val, index) => xScale(index))
      .attr('width', xScale.bandwidth())
      .attr('y', (val) => {
        if (val <= 0) {
          // negative values lay on horizontal axis
          return height / 2;
        }
        return height / 2 - yScale(val);
      })
      .attr('height', (val) => Math.abs(yScale(val)))
      .style('fill', (val) => {
        const lighteningValue = Math.abs(val) / yMax;
        return lighten(this.props.sound.color, lighteningValue);
      })
      .attr('ry', 1);
    svg.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', height / 2)
      .attr('height', 1);
  }

  render() {
    const width = (this.props.useProportionalWidth) ?
      parseInt(PIXELS_PER_SECOND * (this.props.sound.duration), 10) : sassVariables.waveformWidth;
    return (
      <svg
        width={width}
        ref="waveform"
        className={(this.props.useProportionalWidth) ? 'waveform proportional-width' : 'waveform'}
      />
    );
  }
}

Waveform.propTypes = propTypes;
export default Waveform;
