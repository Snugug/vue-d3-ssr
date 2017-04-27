import draw from './d3/radar';
import radar from '../src/radar';

const compiler = require('vue-template-compiler')

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

radar.methods = {
  drawRadar() {
    const dom = new JSDOM('', { runScripts: "outside-only" }).window.document;

    const elem = dom.createElement('div');
    const data = this.data;
    const options = this.options;

    const compiled = compiler.compileToFunctions(draw(elem, data, options)).render;

    return compiled;
  }
}

module.exports = radar;