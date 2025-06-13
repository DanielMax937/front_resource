## 事件循环
每个阶段都有一个要执行的回调FIFO队列。尽管每个阶段都有其自己的特殊方式，但是通常，当事件循环进入给定阶段时，它将执行该阶段特定的任何操作，然后在该阶段的队列中执行回调，直到队列耗尽或执行回调的最大数量为止。当队列为空或达到回调限制时，事件循环将移至下一个阶段，依此类推

每一个阶段都可能调度更多操作，并且在poll阶段处理由内核排队的新事件（比如IO事件），因此可以在处理poll事件时将poll事件排队。最终导致的结果是，长时间运行的回调可使poll阶段运行的时间比timer阈值长得多


1. timers：此阶段执行由 setTimeout 和 setInterval 设置的回调。
2. pending callbacks：执行推迟到下一个循环迭代的 I/O 回调。
3. idle, prepare, ：仅在内部使用。
4. poll：取出新完成的 I/O 事件；执行与 I/O 相关的回调（除了关闭回调，计时器调度的回调和 setImmediate 之外，几乎所有这些回调） 适当时，node 将在此处阻塞。
5. check：在这里调用 setImmediate 回调。
6. close callbacks：一些关闭回调，例如 socket.on('close', ...)。
在每次事件循环运行之间，Node.js 会检查它是否正在等待任何异步 I/O 或 timers，如果没有，则将其干净地关闭。


## 其他
1. 与 setTimeout 相比，使用 setImmediate 的主要优点是，如果在 I/O 周期内 setImmediate 总是比任何 timers 快。
2. setInterval 是 setTimeout 的嵌套调用的语法糖。setInterval(() => {}, 0) 是在每一次事件循环中添加回调到 timers 队列。因此不会阻止事件循环的继续运行，在浏览器上也不会感到卡顿。
3. 无论事件循环的当前阶段如何，都将在当前操作完成之后处理 nextTickQueue。 在此，将操作定义为在 C/C ++ 处理程序基础下过渡并处理需要执行的 JavaScript。

## 为什么用process.nextTick
1. 在事件循环继续之前下个阶段允许开发者处理错误，清理所有不必要的资源，或者重新尝试请求。
2. 有时需要让回调在事件循环继续下个阶段之前运行 (At times it's necessary to allow a callback to run after the call stack has unwound but before the event loop continues.)。

## Microtask
1. 微任务会在主线之后和事件循环的每个阶段之后立即执行。
2. resolved 的 promise.then 回调像微处理一样执行，就像 process.nextTick 一样。 虽然，如果两者都在同一个微任务队列中，则将首先执行 process.nextTick 的回调。
3. 优先级 process.nextTick > promise.then = queueMicrotask

## 其他
node10 以后，微任务执行顺序已经和浏览器保持一致了。即，事件循环阶段队列的每个任务执行完后 立即执行它产生的所有微任务以及微任务执行阶段产生的微任务。不再是等队列中所有任务执行完才执行微任务。


