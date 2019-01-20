'use strict';

const path = require('path');

module.exports = {
  extraConfig: {
    path: path.join(__dirname, '../fixtures/config.custom.js'),
  },
  test: false,
};
