## dead code

1. 代码不会执行
2. 代码执行结果不会被用到
3. 代码只会影响死变量（只写不读）

传统的编译型语言中，传统编译型的语言中，都是由编译器将Dead Code从AST（抽象语法树）中删除，那javascript中是uglify完成

uglify目前不会跨文件去做DCE.

## tree shaking
前面提到了tree-shaking更关注于无用模块的消除，消除那些引用了但并没有被使用的模块。

ES6 module 特点：
1. 只能作为模块顶层的语句出现
2. import 的模块名只能是字符串常量
3. import binding 是 immutable的

ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上，才使得 tree-shaking 成为可能，这也是为什么 rollup 和 webpack 2 都要用 ES6 module syntax 才能 tree-shaking。


### 缺陷
1. 只处理函数和顶层的import和export变量，不能把没用到的累的方法消除掉
2. js动态语言使得静态分析比较难（比如类里有多其他原型的扩展）
