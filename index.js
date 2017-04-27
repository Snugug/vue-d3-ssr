'use strict';

import vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import express from 'express';

import { readFileSync } from 'fs';
import path from 'path';

global.Vue = vue;

// Rollup Madness!
const rollup = require('rollup');
const rollupAlias = require('rollup-plugin-alias');
const rollupReplace = require('rollup-plugin-replace');
const rollupCommon = require('rollup-plugin-commonjs');
const rollupNode = require('rollup-plugin-node-resolve');
const rollupInject = require('rollup-plugin-inject');

let cache;

rollup.rollup({
  entry: 'src/app.js',
  plugins: [
    rollupInject({
      Vue: 'vue/dist/vue.esm.js',
    }),
    rollupReplace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser'),
    }),
    rollupNode(),
    rollupCommon(),
  ],
  cache,
}).then(bundle => {
  const result = bundle.generate({
    map: true,
  });

  cache = bundle;

  bundle.write({
    dest: 'public/bundle.js',
  });
}).catch(e => {
  console.error(e);
});


// Make Vue available globally
// global.Vue = vue;

// Build a server
const server = express();
// Build a renderer
const renderer = createRenderer();

// Grab index file
const layout = readFileSync('./views/index.html', 'utf8');
const layoutSections = layout.split('<div id="app"></div>');
const preAppHTML = layoutSections[0];
const postAppHTML = layoutSections[1];

// Make static assets available
server.use('/public', express.static(
  path.resolve(__dirname, 'public')
));

console.log(layout);

server.get('*', (req, res) => {
  const stream = renderer.renderToStream(require('./src/app'))

  res.write(preAppHTML);

  stream.on('data', chunk => {
    res.write(chunk);
  });

  stream.on('end', () => {
    res.end(postAppHTML);
  });

  stream.on('error', err => {
    console.error(err);

    return res.status(500).send('Server Error');
  });
});


server.listen(5000, err => {
  if (err) throw err;

  console.log('Server is running at localhost:5000');
});