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
Configure information in ${app_root}/config/config.default.js:

### Paths
Support directory path.
> [chokidar#paths](https://github.com/paulmillr/chokidar#api)(string or array of strings). Paths to files, dirs to be watched recursively, or glob patterns.

#### Single path
```js
config.extraConfig: {
  paths: '/your/custom/config/path/config.js',
};
```

#### Multi paths
These files' config reloading has no priority.

However, the same configuration will be overrided in the order of the array only during application starting.

```js
config.extraConfig: {
  paths: [
    '/etc/path/config.js',
    '/etc/path/dir/',
    '/etc/path/this-file-might-override-the-above-files.js',
  ],
};
```

### Extensions
Used to restrict file types.

By default, configuration will be loaded by `require`, this could be dangerous because functions can be executed in a `.js` file.

If you do not want the runtime environment to be destoryed, it is highly recommended to configure `extensions` as `['.json']`.

```js
config.extraConfig: {
  paths: [
    '/etc/path1/',
    '/etc/path2/',
  ],
  extensions: [ '.json' ],
};
```

## TODO
- [ ] 按照egg的[生命周期](https://github.com/eggjs/egg/blob/master/docs/source/en/advanced/loader.md#life-cycles)，应该在configDidLoad()前完成自定义配置的加载，目前放在app.beforeStart()
- [ ] 限制只能重载项目config目录内、或不在app.config内的配置
- [ ] 日志记录变更值
- [ ] 优化配置加载过程
- [ ] 文件变更防抖动

## DONE
- [x] 监听特定目录或文件变更，将变动应用于配置的重载
- [x] 在app.ready()前完成自定义配置的加载，借助了app.beforeStart()
- [x] 优化拷贝过程，支持嵌套对象的内部变更
- [x] 删除自定义配置后，重新加载项目内对应配置
- [x] 支持配置多个文件，参考[chokidar API](https://github.com/paulmillr/chokidar#api)#paths：(string or array of strings) "Paths to files, dirs to be watched recursively, or glob patterns"。 但不做优先级处理，仅在配置加载过程中按照数组顺序来覆盖相同配置。
- [x] 支持目录，~~以egg的方式加载其中配置~~，通过require.resolve修正路径，按照module的形式读取
- [x] 限制文件类型(可选)，例如只监视`.json`，避免`.js`文件破坏运行状态
