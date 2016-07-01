import d3 from 'd3';

// Adapted from: http://bl.ocks.org/jm3/9870108

const MAX_POINTS = 1024;
// TODO: make it responsive
const WIDTH = 200;
const HEIGHT = 100;

function svgRender(data, svg) {
  d3.select(svg).selectAll('*').remove(); // First remove all
  const node = d3.select(svg).append('svg')
    .attr('class', 'chart')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  const y = d3.scale.linear().range([HEIGHT, -HEIGHT]);
  const maxValY = d3.max(data, (d) => d);
  y.domain([-maxValY, maxValY]);
  const barWidth = WIDTH / data.length;

  const chart = node.attr('width', WIDTH).attr('height', HEIGHT);

  const bar = chart.selectAll('g')
    .data(data)
    .enter()
    .append('g') // svg "group"
    .attr('transform', (d, i) => `translate(${i * barWidth}, 0)`);

  bar.append('rect')
    .attr('y', (d) => HEIGHT - Math.abs(y(d) / 2) - HEIGHT / 2 + 2)
    .attr('height', (d) => Math.abs(y(d)))
    .attr('width', barWidth);
}

export function showWaveform(sound) {
  // Prepare data
  const channelData = sound.buffer.getChannelData(0);
  let data = [];
  const iteratorSize = Math.ceil((channelData.length / MAX_POINTS));
  channelData.slice().forEach((val, index) => {
    if (index % iteratorSize === 0) {
      data.push(val);
    }
  });
  data = data.slice(1, MAX_POINTS);

  // Render data
  svgRender(data, '#waveform > .waveform-svg');
}
