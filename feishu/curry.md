## 柯里化

柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
好处是优化代码结构，提高代码更好看，更易懂

```javascript
function curry(fn, length = 4, args = []) {
    return function(...newArgs) {
        const allArgs = [...args, ...newArgs];  // 累积参数
        if (allArgs.length >= length) {
            return fn(...allArgs);  // 参数足够，执行原函数
        } else {
            return curry(fn, length, allArgs);  // 继续收集参数
        }
    };
}

```