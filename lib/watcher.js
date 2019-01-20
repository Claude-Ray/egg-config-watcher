'use strict';

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const extend = require('extend2');

const originConfig = {};

module.exports = app => {
  const { path: configPath } = app.config.extraConfig || {};
  if (!configPath || !fs.existsSync(configPath) || fs.statSync(configPath).isDirectory()) return;
  if (!Object.keys(require.extensions).includes(path.extname(configPath))) return;

  // backup original config
  extend(true, originConfig, app.config);

  // fixme: the appropriate method should be `configDidLoad`.
  app.beforeStart(() => {
    try {
      const customConfig = require(configPath);
      // mount custom config before app starts
      extend(true, app.config, customConfig);
    } catch (err) {
      app.coreLogger.error(`[egg-extra-config] failed to load file "${configPath}" :`, err);
      return;
    }
  });

  const watcher = chokidar.watch(configPath)
    .on('ready', () => {
      app.coreLogger.info('[egg-extra-config] watching files:', watcher.getWatched());
    })
    .on('change', fpath => {
      app.coreLogger.info(`[egg-extra-config] ${fpath} file changed`);
      // reload custom config
      try {
        cleanCache(fpath);
        const source = require(fpath);
        extend(true, app.config, originConfig, source);
        app.coreLogger.info('[egg-extra-config] config reload');
      } catch (err) {
        app.coreLogger.error('[egg-extra-config] config reload failed:', err);
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
