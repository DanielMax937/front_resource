## overview
1. 用集群中的master和worker来区分主进程和工作进程，用work_threads描述工作线程
2. master主要负责接口监听，然后采用循环法作为默认的分发策略
3. 进程隔离，线程共享

## fork过程
1. 设置主线程参数
2. 传入一个自增参数id(就是前文提到的NODE_UNIQUE_ID)和环境信息env来生成一个worker线程的process对象
3. 将id和新的process对象传入Worker构造器生成新的worker进程实例
4. 在子进程的process对象上添加了一些事件监听
5. 在cluster.workers中以id为键添加对子进程的引用
6. 返回子进程worker实例

子进程模块是从master.js调用child_process时启动的，它和主进程是并行执行的
1. 实例化进程管理对象worker
2. 全局添加`disconnect`事件响应
3. 全局添加`internalMessage`事件响应，主要是分发`act:newconn`和`act:disconnect`事件
4. 用send方法发送`online`事件，通知主线程自己已上线。