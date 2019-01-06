'use strict';

const assert = require('assert');
const chokidar = require('chokidar');

class Watcher {
  constructor(options) {
    this.options = options || {};
    assert(this.options.app, 'options.app is required');
    this.app = this.options.app;
    this.logger = this.app.coreLogger;
    if (this.app.config.reload) {
      this.watch(this.app.config.configWatcher.path);
    }
  }

  async reload() {
    this.logger.info('[egg-config-watcher] broadcast config-reload');
    this.app.messenger.sendToApp('config-reload');
    this.app.messenger.sendToAgent('config-reload');
  }

  watch(paths) {
    const watcher = chokidar.watch(paths)
      .on('ready', () => {
        this.logger.info('[egg-config-watcher] watching files:', watcher.getWatched());
      })
      .on('change', fpath => {
        this.app.logger.info(`[egg-config-watcher] ${fpath} file changed`);
        // this.reload();
        // TODO fs.read, then overwrite current app.config
        this.app.logger.warn('[egg-config-watcher] config reload');
      });
  }
}

module.exports = Watcher;
