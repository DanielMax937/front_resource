## 类型
typeof 来判断number, string, object, boolean, function, undefined, symbol 

js在底层存储变量的时候，会在变量的机器码的低位1-3位存储其他类型信息

000：对象
010：浮点数
100：字符串
110：布尔
1：整数

null：所有机器码均为0，由于 null 的所有机器码均为0，因此typeof直接被当做了对象来看待。 当null instanceof null  时，直接报错，这是历史遗留问题
undefined：用 −2^30 整数来表示

一个不错的方法是使用 Object.prototype.toString.call() 方法，它总是返回一个字符串，格式为 [object Xxx]，其中 Xxx 就是对象的类型。这样我们就可以通过正则表达式来获取类型了。

## instanceof
其实 instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。

一个对象的__proto__ 就是 另外一个的构造函数的prototype

## 总结
简单来说，我们使用 typeof 来判断基本数据类型是 ok 的，不过需要注意当用 typeof 来判断 null 类型时的问题，如果想要判断一个对象的具体类型可以考虑用 instanceof，但是 instanceof 也可能判断不准确，比如一个数组，他可以被 instanceof 判断为 Object。所以我们要想比较准确的判断对象实例的类型时，可以采取 Object.prototype.toString.call 方法。
  