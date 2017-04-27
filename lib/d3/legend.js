export default function legend(elem, config, width) {
  const w = config.w || config.width || width;

  const legend = elem.append('g')
    .attr('class', 'legend')
    .attr('height', 100)
    .attr('width', w - 40);

  legend.selectAll('rect')
      .data(config.legend)
      .enter()
      .append('rect')
      .attr('x', w - 65)
      .attr('y', (d, i) => i * 20)
      .attr('width', 20)
      .attr('height', 10)
      .style('fill', (d, i) => config.color[i]);

  legend.selectAll('text')
      .data(config.legend)
      .enter()
      .append('text')
      .attr('x', w - 40)
      .attr('y', (d, i) => i * 20 + 9)
      .attr('font-size', '11px')
      .attr('fill', '#737373')
      .text(d => d);

  return legend;
}
