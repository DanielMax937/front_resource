## TS
https://juejin.cn/post/6994102811218673700?utm_source=gold_browser_extension

关键词
1. keyof，extends, infer
2. 逆变，协变
3. Partial<T> 将T的所有属性变成可选，核心实现是通过映射类型遍历T上所有的遍历，然后将每个属性设置为可选属性
4. Readonly 主要实现是通过映射遍历所有key，然后给每个key增加一个readonly修饰符
5. Pick, 挑选一组属性冰组成一个新的类型
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
6. Record，就是遍历第一个参数每个子类型，然后将值设置为第二参数。Partial、Readonly和Pick都属于同态的，即其实现需要输入类型T来拷贝属性，因此属性修饰符（例如readonly、?:）都会被拷贝。而Record不会。为什么，因为可以看到Pick的实现中，注意P in K（本质是P in keyof T），T为输入的类型，而keyof T则遍历了输入类型；而Record的实现中，并没有遍历所有输入的类型，K只是约束为keyof any的子类型即可。
7.  Exclude, 遍历T中的所有子类型，如果该子类型约束于U（存在于U、兼容于U），never与其他类型的联合后，是没有never的。 T extends U表示遍历T的每个子类型，看子类型是否U的子类型
8. Extract 提取联合类型T和联合联系U的所有交集 type Extract<T, U> = T extends U ? T : never;
9. Omit，主要是找出不在里面的key，比如[P in Exclude<keyof T, K>]
10. Parameters首先约束参数T必须是个函数类型，所以(...args: any) => any>替换成Function也是可以的。
具体实现就是，判断T是否是函数类型，如果是则使用inter P让ts自己推导出函数的参数类型，并将推导的结果存到类型P上，否则就返回never；
11. infer关键词作用是让Ts自己推导类型，并将推导结果存储在其参数绑定的类型上。Eg:infer P 就是将结果存在类型P上，供使用。infer关键词只能在extends条件类型上使用，不能在其他地方使用。
12. ConstructorParameters利用infer推导类型，如果是抽象类，既可以赋值抽象类，也可以赋值普通类
    当把类直接作为类型时，该类型约束的是该类型必须是类的实例；即该类型获取的是该类上的实例属性和实例方法（也叫原型方法）；
    当把typeof 类作为类型时，约束的满足该类的类型；即该类型获取的是该类上的静态属性和方法。
13. type SymmetricDifference<T, U> = Exclude<T | U, T & U>;
14. T[] 是索引访问操作；可以取到值类型；T['a' | 'b'] 若 []内参数是联合类型，则也是分发索性的特性，依次取到值的类型进行联合，T[keyof T]是获取T所有值的类型类型；never和其他类型进行联合时，never是不存在的。null和undefined可以赋值给其他类型。T extends undefined 和 T extends null是等价的。
15. 在判断相等时，为什么要用函数而不是直接extends尼？因为后者对readonly，？这些修饰符无能为力。通过-readonly去掉key的只读属性，通过[keyof T]来表示得到了所有非只读key的联合类型。
16. 同态拷贝会拷贝可选修饰符的特性。利用{} extends {当前key: 类型}判断是否是可选类型
17. 当extends前面的类型是裸类型参数时，会进行分发处理。用元组包裹后，避免这种情况。
18. [P in keyof T]-? 用此来表示是required
19. extends配合infer推导得到U的类型，但是利用infer对协变类型的特性得到交叉类型。（联合类型会变成交叉类型）


## challenges
https://github.com/type-challenges/type-challenges