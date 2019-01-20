# egg-extra-config
[![Build Status](https://travis-ci.org/Claude-Ray/egg-extra-config.svg?branch=master)](https://travis-ci.org/Claude-Ray/egg-extra-config)
[![codecov](https://codecov.io/gh/Claude-Ray/egg-extra-config/branch/master/graph/badge.svg)](https://codecov.io/gh/Claude-Ray/egg-extra-config)

Loading config file outside eggjs project path. Watching this file's changes and auto reloading configurations of `app.config` without restarting process.

## Usage
```js
// plugin.js
exports.extraConfig = {
  enable: true,
  package: 'egg-extra-config',
};
```

## Configuration
```js
// config.default.js
config.extraConfig: {
  path: '/your/custom/config/path/config.js',
};
```

## TODO
- [ ] 按照egg的[生命周期](https://github.com/eggjs/egg/blob/master/docs/source/en/advanced/loader.md#life-cycles)，应该在configDidLoad()前完成自定义配置的加载，目前放在app.beforeStart()
- [ ] 限制只能重载项目config目录内、或不在app.config内的配置
- [ ] 日志记录变更值
- [ ] 限制只监视json文件(可选)，避免破坏运行状态
- [ ] 优化配置加载过程
- [ ] 支持目录，以egg的方式加载其中配置

## DONE
- [x] 监听特定目录或文件变更，将变动应用于配置的重载
- [x] 在app.ready()前完成自定义配置的加载，借助了app.beforeStart()
- [x] 优化拷贝过程，支持嵌套对象的内部变更
- [x] 删除自定义配置后，重新加载项目内对应配置
