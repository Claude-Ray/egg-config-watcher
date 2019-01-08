# egg-config-watcher

To be done...

## DONE
- [x] 监听特定目录或文件变更，将变动应用于配置的重载
- [x] 在app.ready()前完成自定义配置的加载，借助了app.beforeStart()

## TODO
- [ ] 按照egg的[生命周期](https://github.com/eggjs/egg/blob/master/docs/source/en/advanced/loader.md#life-cycles)，应该在configDidLoad()前完成自定义配置的加载。目前放在app.beforeStart()，可能导致有配置加载后，被较晚加载的项目旧配置而覆盖？
- [ ] 限制只能重载项目config目录内、或不在app.config内的配置
- [ ] 优化拷贝过程，支持嵌套对象的内部变更，例如lodash.merge？
- [ ] 日志记录变更值
