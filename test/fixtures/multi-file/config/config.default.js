'use strict';

const path = require('path');

module.exports = {
  extraConfig: {
    paths: [
      path.join(__dirname, '../fixtures/config.custom.js'),
      path.join(__dirname, '../fixtures/config.json'),
    ],
  },
};
