## new
new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一

### 语法
    + 没有显式返回值：new 会返回构造函数中创建的实例对象。
    + 显式返回对象：new 会返回构造函数显式返回的对象。
    + 显式返回非对象值：new 会忽略返回的原始值，依然返回构造函数中创建的实例对象。

```javascript
function objectFactory() {
    var obj = new Object(); // var obj = Object.create(null); 这样更好，不会有任何继承，包括hasOwnProperty
    Constructor = [].shift.call(arguments); // 获取构造函数，并从参数数组移除
    obj.__proto__ = Constructor.prototype; // 指向构造函数的原型
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
};

var person = objectFactory(Otaku, 'Kevin', '18')
```