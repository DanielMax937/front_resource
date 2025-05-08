## Tapable
tapable 是一个类似于nodejs 的EventEmitter 的库, 主要是控制钩子函数的发布与订阅。当然，tapable提供的hook机制比较全面，分为同步和异步两个大类(异步中又区分异步并行和异步串行)，而根据事件执行的终止条件的不同，由衍生出 Bail/Waterfall/Loop 类型。

## 钩子类型
- BasicHook：执行每一个，不关心函数的返回值，有SyncHook、AsyncParallelHook、AsyncSeriesHook。
- BailHook：顺序执行 Hook，遇到第一个结果result!==undefined则返回，不再继续执行。有：SyncBailHook、AsyncSeriseBailHook, AsyncParallelBailHook。
- WaterfallHook：类似于 reduce，如果前一个 Hook 函数的结果 result !== undefined，则 result 会作为后一个 Hook 函数的第一个参数。既然是顺序执行，那么就只有 Sync 和 AsyncSeries 类中提供这个Hook：SyncWaterfallHook，AsyncSeriesWaterfallHook
- LoopHook：不停的循环执行 Hook，直到所有函数结果 result === undefined。同样的，由于对串行性有依赖，所以只有 SyncLoopHook 和 AsyncSeriseLoopHook

## 流程
1. 注册阶段--_insert将排序tap放入到taps树组中
2. 触发阶段--通过compile方法（本质就是new Function）来创建函数，然后调用

## webpack-plugin

### compile
compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用 compiler 来访问 webpack 的主环境。 它继承自Tapable

### compilation
compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。它继承自Tapable

插件本质就是apply中传入一个Compiler实例， 然后基于该实例注册事件， compilation同理， 最后webpack会在各流程执行call方法。由于是基于tapable实现的，所以可以使用tapable提供的各种钩子函数来实现插件的功能。在编译各个环节使用

