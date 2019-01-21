'use strict';

const mm = require('egg-mock');
const assert = require('assert');
const utils = require('./utils');

describe('test/extensions', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.app({
      baseDir: 'extensions',
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => utils.sleep(500));

  it('should ignore json', () => {
    assert(app.config.test === 'js');
  });
});
