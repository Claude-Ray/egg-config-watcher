'use strict';

const path = require('path');
const chokidar = require('chokidar');
const extend = require('extend2');

const originConfig = {};

module.exports = app => {
  const { paths, extensions } = app.config.extraConfig || {};
  let configPaths = Array.isArray(paths) ? paths : [ paths ];

  configPaths = configPaths.map(resolveModule).filter(Boolean);

  if (Array.isArray(extensions) && extensions.length > 0) {
    configPaths = configPaths.filter(configPath => {
      const extname = path.extname(configPath);
      if (Array.isArray(extensions) && !extensions.includes(extname)) return false;
      if (!Object.keys(require.extensions).includes(extname)) return false;
      return true;
    });
  }

  // backup original config
  extend(true, originConfig, app.config);

  // fixme: the appropriate method should be `configDidLoad`.
  // mount custom config before app starts
  app.beforeStart(() => {
    // config will be overwritten layer by layer
    configPaths.forEach(configPath => {
      try {
        const customConfig = require(configPath);
        extend(true, app.config, customConfig);
      } catch (err) {
        app.coreLogger.error(`[egg-extra-config] failed to load file "${configPath}" :`, err);
      }
    });
  });

  const watcher = chokidar.watch(configPaths)
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
 * @param {string} filepath - config path
 * @return {string} module path
 */
function resolveModule(filepath) {
  try {
    return require.resolve(filepath);
  } catch (e) {
    return undefined;
  }
}

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
