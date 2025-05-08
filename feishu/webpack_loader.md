## loader

webpack中想要加载less文件需要使用less-loader， style-loader， css-loader

### style-loader
将css代码插入到head中

### css-loader
解决@import和url()的引入问题

### less-loader
将less编译成css，在包装成module.exports, 成为一个js module

loader 本质上是一个函数，输入参数是一个字符串，输出参数也是一个字符串。当然，输出的参数会被当成是 JS 代码，从而被 esprima 解析成 AST，触发进一步的依赖解析。

🧠 工作原理（简单流程）：
1.	资源引入：当你在代码中 import 一个资源时，比如 .css、.png、.ts 文件；
2.	匹配规则：Webpack 根据 module.rules 中的 test 规则找到对应的 loader；
3.	链式处理：
    + loader 从右向左执行（或者说从下到上）；
    + 每个 loader 接收上一个 loader 的输出；
4.	返回 JavaScript 模块：最终 loader 要返回的是 JS 代码，Webpack 才能继续构建依赖图。

loader的使用类似洋葱模型，最里面的先执行，所以说从右到左