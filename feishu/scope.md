核心特性总结：
1. 词法作用域：函数作用域在定义时确定，通过 [[scope]] 属性固化
2. 链式查找：变量访问沿 AO → parent VO → ... → globalVO 链路搜索
3. 动态组合：每次调用都会创建新的 AO，与静态 [[scope]] 组合成完整作用域链
4. 执行隔离：通过上下文栈管理保证各次函数调用的作用域独立性
5. 这种机制解释了 JavaScript 闭包的工作原理：即使外部函数执行结束，只要内部6. 函数持有对外部函数 AO 的引用，该 AO 就不会被销毁。
7. 先创建scope，再创建context


以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
执行过程如下：

1.checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

    checkscope.[[scope]] = [
        globalContext.VO
    ];

2.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

    ECStack = [
        checkscopeContext,
        globalContext
    ];
    
3.checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

    checkscopeContext = {
        Scope: checkscope.[[scope]],
    }

4.第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

    checkscopeContext = {
        AO: {
            arguments: {
                length: 0
            },
            scope2: undefined
        }，
        Scope: checkscope.[[scope]],
    }

5.第三步：将活动对象压入 checkscope 作用域链顶端

    checkscopeContext = {
        AO: {
            arguments: {
                length: 0
            },
            scope2: undefined
        },
        Scope: [AO, [[Scope]]]
    }

6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

    checkscopeContext = {
        AO: {
            arguments: {
                length: 0
            },
            scope2: 'local scope'
        },
        Scope: [AO, [[Scope]]]
    }

7.查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

    ECStack = [
        globalContext
    ];