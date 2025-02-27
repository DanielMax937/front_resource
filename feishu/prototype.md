1. 函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型
2. 每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。
3. 实例.__proto__ === 构造函数.prototype === 实例原型（本身也是一个实例）
4. 构造函数.prototype.constructor === 构造函数本身
5. 原型链其实是说的是XX.prototype, 最终指向Object.prototype,最终是null
6. 所谓的继承属性，是说的prototype的属性