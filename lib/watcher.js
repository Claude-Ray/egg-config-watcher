'use strict';

const fs = require('fs');
const chokidar = require('chokidar');

module.exports = app => {
  const { path } = app.config.configWatcher || {};
  if (!path || !fs.existsSync(path) || fs.statSync(path).isDirectory()) return;

  const watcher = chokidar.watch(path)
    .on('ready', () => {
      let customConfig;
      try {
        customConfig = require(path);
      } catch (err) {
        app.coreLogger.error('[egg-config-watcher] load config fails:', err, watcher.getWatched());
        watcher.unwatch(path);
        return;
      }
      // mount custom config
      Object.assign(app.config, customConfig);
      app.coreLogger.info('[egg-config-watcher] watching files:', watcher.getWatched());
    })
    .on('change', fpath => {
      app.coreLogger.info(`[egg-config-watcher] ${fpath} file changed`);
      // reload custom config
      try {
        cleanCache(fpath);
        const source = require(fpath);
        Object.assign(app.config, source);
        app.coreLogger.info('[egg-config-watcher] config reload');
      } catch (err) {
        app.coreLogger.error('[egg-config-watcher] config reload failed:', err);
      }
    });
};

/**
 * @ref http://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/
 * @param {string} filePath - custom config file's path
 */
function cleanCache(filePath) {
  const modulePath = require.resolve(filePath);
  const module = require.cache[modulePath];
  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }
  delete require.cache[modulePath];
}
