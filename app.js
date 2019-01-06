'use strict';
const Watcher= require('./lib/watcher');

module.exports = app => {
  new Watcher({ app });
  app.messenger.on('config-reload', () => {
    app.loader.loadConfig();
    app.coreLogger.info('[egg-config-watcher] app reload: got config-reload message');
  });
};
