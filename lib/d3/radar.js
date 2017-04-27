import {schemeCategory10} from 'd3-scale';
import max from 'lodash/max';
import {select} from 'd3-selection';

export default function(elem, data, options) {
  const config = {
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: .85,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: .6,
      toRight: 5,
      translateX: 80,
      translateY: 30,
      extraWidthX: 200,
      extraWidthY: 100,
      color: schemeCategory10,
    };

    if (typeof options !== 'undefined') {
      for (let i in options) {
        config[i] = options[i];
      }
    }

    config.maxValue = Math.max(config.maxValue, max([].concat.apply([], data.map(i => i.map(o => o.value)))));

    const allAxis = data[0].map((i, j) => i.axis);
    const total = allAxis.length;
    const radius = config.factor * Math.min(config.w / 2, config.h / 2);

    const g = select(elem)
      .append('svg')
      .attr('width', config.w + config.extraWidthX)
      .attr('height', config.h + config.extraWidthY)
      .append('g')
      .attr('transform', `translate(${config.translateX}, ${config.translateY})`);

    let tooltip = g.append('text')
      .style('opacity', 0)
      .style('font-family', 'sans-serif')
      .style('font-size', '13px');

    // // Circular segments
    for (let j = 0; j < config.levels - 1; j++) {
      const levelFactor = config.factor * radius * ((j + 1) / config.levels);

      g.selectAll('.levels')
        .data(allAxis)
        .enter()
        .append('svg:line')
        .attr('x1', (d, i) => levelFactor * (1 - config.factor * Math.sin(i * config.radians / total)))
        .attr('y1', (d, i) => levelFactor * (1 - config.factor * Math.cos(i * config.radians / total)))
        .attr('x2', (d, i) => levelFactor * (1 - config.factor * Math.sin((i + 1) * config.radians / total)))
        .attr('y2', (d, i) => levelFactor * (1 - config.factor * Math.cos((i + 1) * config.radians / total)))
        .attr('class', 'line')
        .style('stroke', 'grey')
        .style('stroke-opacity', '.75')
        .style('stroke-width', '.3px')
        .attr('transform', `translate(${config.w / 2 - levelFactor}, ${config.h / 2 - levelFactor})`);
    }

    // // Text including at what % each level is
    for (let j = 0; j < config.levels; j++) {
      const levelFactor = config.factor * radius * ((j + 1) / config.levels);

      g.selectAll('.levels')
        .data([1])
        .enter()
        .append('svg:text')
        .attr('x', d => levelFactor * (1 - config.factor * Math.sin(0)))
        .attr('y', d => levelFactor * (1 - config.factor * Math.cos(0)))
        .style('font-family', 'sans-serif')
        .style('font-size', '10px')
        .attr('transform', `translate(${config.w / 2 - levelFactor + config.toRight}, ${config.h / 2 - levelFactor})`)
        .attr('fill', '#737373')
        .text(j + 1);
    }

    const axis = g.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis')

    axis.append('line')
      .attr('x1', config.w / 2)
      .attr('y1', config.h / 2)
      .attr('x2', (d, i) => config.w / 2 * (1 - config.factor * Math.sin(i * config.radians / total)))
      .attr('y2', (d, i) => config.h / 2 * (1 - config.factor * Math.cos(i * config.radians / total)))
      .attr('class', 'line')
      .attr('stroke', 'grey')
      .style('stroke-width', '1px')


    axis.append('text')
      .attr('class', 'legend')
      .text(d => d)
      .style('font-family', 'sans-serif')
      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('transform', () => 'translate(0, -10)')
      .attr('x', (d, i) => config.w / 2 * (1 - config.factorLegend * Math.sin(i * config.radians / total)) - 60 * Math.sin(i * config.radians / total))
      .attr('y', (d, i) => config.h / 2 * (1 - Math.cos(i * config.radians / total)) - 20 * Math.cos(i * config.radians / total));

    let series = 0;

    // Polygons
    data.forEach((y, x) => {
      let dataValues = [];
      g.selectAll('.nodes')
        .data(y, (j, i) => {
          dataValues.push([
            config.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.sin(i * config.radians / total)),
            config.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.cos(i * config.radians / total))
          ]);
        });

      dataValues.push(dataValues[0]);

      g.selectAll('.area')
        .data([dataValues])
        .enter()
        .append('polygon')
        .attr('class', `radar-chart-serie${series}`)
        .style('stroke-width', '2px')
        .style('stroke', config.color[x])
        .attr('points', d => {
          let str = '';
          let pti = 0;
          for (pti = 0; pti < d.length; pti++) {
            str += `${d[pti][0]},${d[pti][1]} `;
          }
          return str;
        })
        .style('fill', () => config.color[x])
        .style('fill-opacity', config.opacityArea)

      series++;
    });

    series = 0;

    // Dots
    data.forEach((y, x) => {
      let dataValues = [];
      g.selectAll('.nodes')
        .data(y)
        .enter()
        .append('svg:circle')
        .attr('class', `radar-chart-serie${series}`)
        .attr('r', config.radius)
        .attr('alt', j => Math.max(j.value, 0))
        .attr('cx', (j, i) => {
          dataValues.push([
            config.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.sin(i * config.radians / total)),
            config.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / config.maxValue) * config.factor * Math.cos(i * config.radians / total))
          ]);

          return config.w / 2 * (1 - (Math.max(j.value, 0) / config.maxValue) * config.factor * Math.sin(i * config.radians / total));
        })
        .attr('cy', (j, i) => {
          return config.h / 2 * (1 - (Math.max(j.value, 0) / config.maxValue) * config.factor * Math.cos(i * config.radians / total))
        })
        .attr('data-id', j => j.axis)
        .style('fill', config.color[x])
        .style('fill-opacity', .9)
        .append('svg:title')
        .text(j => Math.max(j.value, 0));
    });

    return elem.innerHTML;
}