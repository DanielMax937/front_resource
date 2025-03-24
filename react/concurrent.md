## 并发模式的演进背景

### 传统渲染的局限性：
1. React 16 之前的 Stack Reconciler 采用递归方式处理虚拟 DOM，存在不可中断的同步渲染问题
2. 复杂组件树会导致主线程长时间阻塞（通常 > 16ms），造成掉帧、交互迟滞
3. 紧急更新（如用户输入）无法插队处理，必须等待当前渲染完成

### Fiber 架构奠基：
1. React 16 引入 Fiber 架构，将渲染过程拆分为增量式工作单元
2. 实现链表结构的虚拟栈帧（Fiber Node），支持暂停/恢复渲染
3. 为并发模式打下数据结构基础

## 并发模式的实现原理

### 可中断渲染
```js
// 传统同步渲染模式
function syncRender(element, container) {
    // 不可中断的递归过程
    reconcileTree(element, container.current);
    commitRoot(container);
}

// 并发模式下的渲染
function concurrentRender(element, container) {
    const root = createRoot(container);
    root.render(element); // 可中断的异步过程
}
```

### 时间切片
```js
function workLoop(deadline) {
    // 渲染工作变成5ms的chunk，超过就开始执行任务
    while (currentTask && deadline.timeRemaining() > 5) {
        performUnitOfWork(currentTask);
    }
    requestIdleCallback(workLoop);
}
```

### 双缓冲机制
1. 维护两棵 Fiber 树：current（当前展示）和 workInProgress（构建中）
2. 通过 alternate 属性链接两个树的对应节点
3. 完成构建后通过原子操作切换指针

## 优先级调度系统
1. Lane模型
2. 更新分类
    + 紧急更新（Urgent updates）：用户输入、点击等交互行为
    + 过渡更新（Transition updates）：界面切换、数据加载等非紧急任务
    + 后天更新（Idle updates）：后台数据同步、预加载等低优先级任务
3. 调度器原理
    + 通过位运算合并不同优先级的 Lane
    + 通过 updateLanes & renderLanes 判断当前任务类型
    + 通过时间切片实现任务分片执行
    + 基于浏览器 requestIdleCallback 的 polyfill
    + 任务队列管理（最小堆实现）

```js
const taskQueue = new MinHeap();
function scheduleCallback(priority, callback) {
    const startTime = getCurrentTime();
    const expirationTime = startTime + timeout;
    const newTask = { id: taskId++, callback, priority, expirationTime };
    push(taskQueue, newTask);
    requestHostCallback(flushWork);
}
```

### 调度流程
performConcurrentWorkOnRoot 
→ renderRootSync 
→ workLoopSync 
→ performUnitOfWork 
→ beginWork

```js
function scheduleUpdateOnFiber(fiber, lane) {
    const root = markUpdateLaneFromFiberToRoot(fiber, lane);
    if (lane === SyncLane) {
        ensureRootIsScheduled(root);
    } else {
        scheduleCallback(NormalPriority, performConcurrentWorkOnRoot.bind(null, root));
    }
}
```

## 其他
引入的新语法，Suspense，React.lazy, useTransition

## 优化策略
1. 饥饿问题预防：
    + 动态优先级提升机制
    + 超时任务强制执行（通过 expirationTime）

2. 渲染节流控制：
    + 批量更新（Automatic Batching）
    + 过渡更新的去抖动处理

3. 内存管理优化：
    + Fiber 节点池复用
    + 中断时的上下文保存/恢复