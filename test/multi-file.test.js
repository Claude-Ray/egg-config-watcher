'use strict';
const fs = require('fs');
const mm = require('egg-mock');
const assert = require('assert');
const utils = require('./utils');

describe('test/multi-file', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.app({
      baseDir: 'multi-file',
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should overwrite config layer by layer', async () => {
    assert(app.config.test === 'json');
  });

  it('should overwrite config after any file changes', async () => {
    const filePath = app.config.extraConfig.paths[0];
    const backupContent = fs.readFileSync(filePath);
    after(() => fs.writeFileSync(filePath, backupContent));

    const testContent = 'module.exports = { test: "JS" };';
    fs.writeFileSync(filePath, testContent);
    await utils.sleep(500);
    assert(app.config.test === 'JS');
  });
});
