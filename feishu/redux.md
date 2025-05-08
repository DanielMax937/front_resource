## overview
1. 视图和状态一一对应，知道state，就知道view

## 概念
1. Store：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个Store。
2. State：Store对象包含所有数据，如果想得到某个时点的数据，就要对Store生成快照，这种时点的数据集合，就叫做State。
3. Action：State的变化，会导致View的变化。但是，用户接触不到State，只能接触到View。所以，State的变化必须是View导致的。Action就是View发出的通知，表示State应该要发生变化了。
4. Action Creator：View要发送多少种消息，就会有多少种Action。如果都手写，会很麻烦，所以我们定义一个函数来生成Action，这个函数就叫Action Creator。
5. Reducer：Store收到Action以后，必须给出一个新的State，这样View才会发生变化。这种State的计算过程就叫做Reducer。Reducer是一个函数，它接受Action和当前State作为参数，返回一个新的State。
6. dispatch：是View发出Action的唯一方法。

## 流程
1. 首先，用户（通过View）发出Action，发出方式就用到了dispatch方法。
2. 然后，Store自动调用Reducer，并且传入两个参数：当前State和收到的Action，Reducer会返回新的State
3. State一旦有变化，Store就会调用监听函数，来更新View。



## Redux解决的问题
前端复杂性的根本原因是大量无规律的交互和异步操作。
每个State变化可预测。
动作与状态统一管理。

## 读写分离
整体的思想是把Query操作和Command操作分成两块独立的库来维护，当事件库有更新时，再来同步读取数据库。
数据总是“单向流动”，任何相邻的部分都不会发生数据的“双向流动”。

## Redux中没有Dispatcher的概念
Redux去除了这个Dispatcher，使用Store的Store.dispatch()方法来把action传给Store，由于所有的action处理都会经过这个Store.dispatch()方法，Redux聪明地利用这一点，实现了与Koa、RubyRack类似的Middleware机制。Middleware可以让你在dispatch action后，到达Store前这一段拦截并插入代码，可以任意操作action和Store。很容易实现灵活的日志打印、错误收集、API请求、路由等操作。

## store.subscribe()方法总结
入参函数放入监听队列
返回取消订阅函数

## store.dispatch()方法总结
调用Reducer，传参（currentState，action）。
按顺序执行listener。
返回action。

## 最佳实践
用对象展开符增加代码可读性。
区分smart component（know the State）和dump component（完全不需要关心State）。
component里不要出现任何async calls，交给action creator来做。
Reducer尽量简单，复杂的交给action creator。
Reducer里return state的时候，不要改动之前State，请返回新的。
immutable.js配合效果很好（但同时也会带来强侵入性，可以结合实际项目考虑）。
action creator里，用promise/async/await以及Redux-thunk（redux-saga）来帮助你完成想要的功能。
action creators和Reducer请用pure函数。
请慎重选择组件树的哪一层使用connected component(连接到Store)，通常是比较高层的组件用来和Store沟通，最低层组件使用这防止太长的prop chain。
请慎用自定义的Redux-middleware，错误的配置可能会影响到其他middleware.
有些时候有些项目你并不需要Redux（毕竟引入Redux会增加一些额外的工作量）


## 为什么要嵌套函数？为何不在一层函数中传递三个参数，而要在一层函数中传递一个参数，一共传递三层？
因为中间件是要多个首尾相连的，对next进行一层层的“加工”，所以next必须独立一层。那么Store和action呢？Store的话，我们要在中间件顶层放上Store，因为我们要用Store的dispatch和getState两个方法。action的话，是因为我们封装了这么多层，其实就是为了作出更高级的dispatch方法，是dispatch，就得接受action这个参数。

## middlewareAPI中的dispatch为什么要用匿名函数包裹呢？
我们用applyMiddleware是为了改造dispatch的，所以applyMiddleware执行完后，dispatch是变化了的，而middlewareAPI是applyMiddleware执行中分发到各个middleware，所以必须用匿名函数包裹dispatch，这样只要dispatch更新了，middlewareAPI中的dispatch应用也会发生变化。

## 在middleware里调用dispatch跟调用next一样吗？
因为我们的dispatch是用匿名函数包裹，所以在中间件里执行dispatch跟其它地方没有任何差别，而执行next相当于调用下个中间件