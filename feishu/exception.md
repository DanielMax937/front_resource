## 异常
1. 由于try/catch无法捕捉异步回调里的异常，Nodejs原生提供uncaughtException事件挂到process对象上，捕捉未处理的异常。
2. uncaughtException会丢失上下文，同时，一旦触发该事件，整个node会crash掉
3. 可以通过domain的方式监听异常，且如果使用domain，则uncaughtException就不会触发（目前推荐使用domain，然后通过事件分发的方式实现）