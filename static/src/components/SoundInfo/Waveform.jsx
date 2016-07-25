import React from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import '../../stylesheets/Waveform.scss';
import sassVariables from 'json!../../stylesheets/variables.json';
import { downsampleSignal } from '../../utils/misc';
import { lighten } from '../../utils/colors';


const propTypes = {
  sound: React.PropTypes.object,
};

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
    const { waveformWidth, waveformHeight } = sassVariables;
    this.drawWaveForm(downsampledSignal, waveformWidth, waveformHeight);
  }

  drawWaveForm(downsampledSignal, waveformWidth, waveformHeight) {
    const svg = select(this.refs.waveform);
    svg.selectAll('*').remove();
    const width = parseInt(waveformWidth, 10);
    const height = parseInt(waveformHeight, 10);
    const xScale = scaleBand()
      .range([0, width])
      .padding(0.3);
    xScale.domain(downsampledSignal.map((val, index) => index));
    const yMax = Math.max.apply(null, downsampledSignal.map(Math.abs));
    const yScale = scaleLinear()
      .range([0, height / 2])
      .domain([0, yMax]);
    svg.selectAll('.bar')
      .data(downsampledSignal)
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
