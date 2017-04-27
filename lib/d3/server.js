'use strict';

const jsdom = require('jsdom');

module.exports = jsdom.env({
  html: '',
  features: {QuerySelector: true},
});