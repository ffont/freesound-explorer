import React from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import sassVariables from 'stylesheets/variables.json';
import { lighten } from 'utils/colorsUtils';
import { arrayMean } from 'utils/arrayUtils';
import './Waveform.scss';

const propTypes = {
  sound: PropTypes.object,
};

const downsampleSignal = (signal, numberOfPoints = 50) => {
  const iteratorSize = Math.ceil((signal.length / numberOfPoints));
  const points = [...Array(numberOfPoints).keys()];
  const downsampledSignal = points.map((pointIndex) => {
    const slicedArray = signal.slice(pointIndex * iteratorSize, (pointIndex + 1) * iteratorSize);
    return arrayMean(slicedArray);
  });
  return downsampledSignal;
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
      // retry later to check if buffer is available then
      const WAIT_TILL_RETRY = 500;
      setTimeout(() => this.forceUpdate(), WAIT_TILL_RETRY);
      return;
    }
    const signal = this.props.sound.buffer.getChannelData(0);
    const downsampledSignal = downsampleSignal(signal);
    const symmetricSignal = buildSymmetricSignal(downsampledSignal);
    const { waveformWidth, waveformHeight } = sassVariables;
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
    return (
      <svg ref="waveform" className="waveform" />
    );
  }
}

Waveform.propTypes = propTypes;
export default Waveform;
