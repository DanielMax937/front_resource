## 事件循环
分游览器和nodejs两种
1. webworker，所有新线程都受主线程的完全控制，不能独立执行，算是子线程。而且这些现场没有执行IO操作的权限，只能分担一些诸如计算等任务
2. 数据存放的栈和堆
   - 栈：存放基础类型和对象的指针
   - 堆：存放对象
3. 执行栈，非阻塞，事件队列
4. 步骤
    1. 碰到异步事件后执行挂起
    2. 返回后加入到事件队列
    3. 等当前执行栈都完成后处于闲置状态去查找事件队列是否有任务，有就取出并放到执行栈中
    4. 微任务（new Promise和new MutaionObserver）和宏任务（setInterval和setTimeout）
    5. 当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行。

### nodejs
1. poll--> 轮询阶段，检查是否有事件需要处理
2. check--> 检查阶段，执行setImmediate
3. close--> 关闭阶段，执行close事件
4. timers--> 定时器阶段，执行setTimeout和setInterval
5. I/O callbacks--> 执行I/O回调
6. idle, prepare--> 空闲阶段，准备阶段

### process.nextTick()
1. 在准备进入下一个阶段时会优先执行，而且会执行为空

### setTimeout()会有延迟，node会在可以执行timer回调时第一时间去执行你所设定的任务
### setImmediate在poll阶段执行
1. setImmediate和setTimeout 0的执行时机不确定，但是如果是io回调里，setImmediate会优先执行



