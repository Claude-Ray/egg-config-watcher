'use strict';

const Watcher = require('./lib/watcher');

module.exports = agent => {
  new Watcher({ app: agent });
  agent.messenger.on('config-reload', () => {
    agent.loader.loadConfig();
    agent.coreLogger.info('[egg-config-watcher] agent reload: got config-reload message');
  });
};
