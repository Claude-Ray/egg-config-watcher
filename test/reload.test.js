'use strict';
const fs = require('fs');
const mm = require('egg-mock');
const assert = require('assert');

describe('test/config-reload', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.app({
      baseDir: 'config-reload',
    });
    return app.ready();
  });
  after(() => app.close());
  beforeEach(() => sleep(500));
  afterEach(mm.restore);

  it('should reload config when file has been changed', async () => {
    assert(app.config.test === true);

    const filePath = app.config.configWatcher.path;
    const backupContent = fs.readFileSync(filePath);
    const testContent = 'module.exports = {test: false};';
    after(() => fs.writeFileSync(filePath, backupContent));

    fs.writeFileSync(filePath, testContent);
    await sleep(500);
    assert(app.config.test === false);

    fs.writeFileSync(filePath, backupContent);
    await sleep(500);
    assert(app.config.test === true);
  });
});

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
