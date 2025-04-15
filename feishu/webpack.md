## 配置
1. entry -- 模块构建的起点，一个入口文件对应最后生成的一个chunk
2. resolve -- 模块解析的配置，可加快打包
3. output -- 终点，包括输出文件和输出路径
4. module -- 配置了处理各模块的loader，包括css loader，js loader，图片 loader
5. plugins -- 各插件对象，在webpack的事件流中执行对应的方法

loader：能转换各类资源，并处理成对应模块的加载器。loader 间可以串行使用。
chunk：code splitting 后的产物，也就是按需加载的分块，装载了不同的 module。


![webpack](https://img.alicdn.com/tps/TB1GVGFNXXXXXaTapXXXXXXXXXX-4436-4244.jpg?x-oss-process=image/resize,w_1400/format,webp)

webpack 的实际入口是 Compiler 中的 run 方法，run 一旦执行后，就开始了编译和构建流程 ，其中有几个比较关键的 webpack 事件节点。

compile 开始编译
make 从入口点分析模块及其依赖的模块，创建这些模块对象
build-module 构建模块
after-compile 完成构建
seal 封装构建结果
emit 把各个chunk输出到结果文件
after-emit 完成输出

## 整体流程
1. 核心对象compilation
负责组织整个打包过程，包含了每个构建环节及输出环节所对应的方法

2. 在创建module之前，Compiler会触发make，然后构建模块

webpack 的整体流程主要还是依赖于 compilation 和 module 这两个对象，但其思想远不止这么简单。最开始也说过，webpack 本质是个插件集合，并且由 tapable 控制各插件在 webpack 事件流上运行，至于具体的思想和细节，将会在后一篇文章中提到。同时，在业务开发中，无论是为了提升构建效率，或是减小打包文件大小，我们都可以通过编写 webpack 插件来进行流程上的控制，这个也会在之后提到。