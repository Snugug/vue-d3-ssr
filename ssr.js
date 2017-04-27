'use strict';

const fs = require('fs');
const path = require('path');

global.Vue = require('vue');

const layout = fs.readFileSync('views/index.html', 'utf8');

var renderer = require('vue-server-renderer').createRenderer();

const express = require('express');

const server = express();

server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
));

let layoutSections = layout.split('<div id="app"></div>')
let preAppHTML = layoutSections[0] ;
let postAppHTML = layoutSections[1];

server.get('*', (req, res) => {
  const stream = renderer.renderToStream(require('./assets/app')())

  res.write(preAppHTML)

  stream.on('data', chunk => {
    res.write(chunk)
  })

  stream.on('end', () => {
    res.end(postAppHTML)
  })

  stream.on('error', err => {
    console.error(err)

    return res.status(500).send('Server Error')
  })
})

//////////////////////////////
// D3 Server
//////////////////////////////
import radar from './lib/d3/radar';

import radarOptions from './lib/radar';

const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const dom = new JSDOM('', { runScripts: "outside-only" }).window.document;

const elem = dom.createElement('div');
const output = radar(elem, radarOptions.data);

console.log(output);
// const d3Server = require('./lib/d3/server');

// const foo = new d3Server;

// foo.done = (err, window) => {
//   const elem = window.document.createElement('div');
//   const output = radar(elem, radarOptions.data);

//   console.log(output);
// }


server.listen(5000, err => {
  if (err) throw err

  console.log('Server is running at localhost:5000')
})