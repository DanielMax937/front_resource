1. React Hooks 的实现原理基于闭包与链表结构，通过Fiber 架构中的 memoizedState 链表来管理组件的状态和副作用。
2. Fiber 节点的 memoizedState：是函数组件 Hooks 链表的头节点，用于管理所有 Hooks 的集合。Hook 对象的 memoizedState：存储该 Hook 的具体状态或数据（如 state、effect 对象等）。
Fiber 节点的 memoizedState 是一个链表头指针，指向该函数组件内部所有 Hooks 构成的链表。
```javascript
type Fiber = {
  tag: WorkTag,          // 标识组件类型（函数组件、类组件等）
  memoizedState: any,    // 函数组件的 Hooks 链表 或 类组件的 state
  stateNode: any,        // 组件实例（类组件）或 DOM 节点
  // ...其他属性（如 updateQueue、flags 等）
};
```
每个 Hook 对象（如 useState、useEffect）的 memoizedState 属性存储该 Hook 的具体状态值或
```javascript
type Hook = {
  memoizedState: any,      // 当前 Hook 的状态或数据
  baseState: any,          // 基础状态（用于更新计算）
  baseQueue: Update | null,// 未处理的更新队列
  queue: UpdateQueue | null,// 更新队列（如 useState 的更新队列）
  next: Hook | null,       // 指向下一个 Hook
};
```

+ Mount 阶段：首次渲染时，React 通过 mountWorkInProgressHook 创建 Hook 对象，并构建链表。例如 useState 的 mountState 方法会初始化状态，并绑定更新函数。React 创建 Hooks 链表，将头节点赋值给 Fiber 的 memoizedState。
```javascript
// 模拟 useState 的简化实现
let memoizedState = [];
let cursor = 0;
function useState(initialValue) {
  const state = memoizedState[cursor] ?? initialValue;
  const _cursor = cursor; // 闭包保存当前游标
  const setState = (newValue) => (memoizedState[_cursor] = newValue);
  cursor++;
  return [state, setState];
}

// 创建 Hook 对象并添加到链表
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    queue: null,
    next: null,
  };
  if (workInProgressHook === null) {
    // 第一个 Hook，作为链表头
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 添加到链表尾部
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```
+ Update 阶段：组件更新时，React 按顺序遍历链表，复用已有的 Hook 对象，并执行更新逻辑。例如 useState 的 updateState 会从队列中取出更新计算新状态值。React 会根据 Hook 的 memoizedState 属性判断是否需要更新。

```javascript
function updateWorkInProgressHook(): Hook {
  let nextHook = currentHook.next;
  currentHook = nextHook; // 移动到下一个节点
  return currentHook;
}
```

+ 依赖数组与副作用管理： useEffect 的依赖数组通过浅比较决定是否重新执行回调。若依赖为空数组（[]），则仅在 Mount 阶段执行一次；若依赖变化，则销毁旧副作用并创建新的

```javascript
function renderWithHooks(component, props) {
  const fiber = getCurrentFiber();
  fiber.memoizedState = null; // 重置链表
  let hooks = [];
  // ...构建 Hooks 链表
  fiber.memoizedState = hooks[0]; // 链表头节点
}

// useState 的 mount 阶段初始化 Hook.memoizedState
function mountState(initialState) {
  const hook = createNewHook();
  hook.memoizedState = initialState; // 存储初始值
  return [hook.memoizedState, dispatchAction];
}
```

## 闭包陷阱
Hooks 依赖闭包保存状态，若在异步回调（如 setInterval）中直接引用外部变量，会捕获初始状态值，导致后续更新无法获取最新值。解决方案是使用 useRef 保存可变引用，或通过 useEffect 监听变化。或者使用 setCount(c => c + 1) 替代 setCount(count + 1)，避免依赖闭包中的旧值


## 状态更新机制
useState 的更新通过 dispatchAction 触发，将更新操作（action）加入队列，并标记 Fiber 节点需要重新渲染

```javascript
function dispatchAction(queue, action) {
  const update = { action, next: null };
  // 将更新加入队列，并触发调度
  queue.pending = update;
  scheduleWork();
}
```

### Effect 处理
useEffect 的 Effect 对象会被收集到 Fiber 的 updateQueue 中，在 Commit 阶段执行。若依赖变化，旧 Effect 的清理函数会先执行

Hooks 必须在函数顶层调用，不可嵌套在条件/循环中。因链表顺序依赖 Hook 的调用顺序，顺序变化会导致状态错乱

## 总结
1. 为什么必须保证 Hook 顺序一致？
链表按顺序关联 Hook，若某次渲染跳过某个 Hook（如条件语句），后续 Hook 的索引或指针将错位，导致状态混乱。

2. 为什么选择链表而非数组？
链表动态增删成本低，但 React 要求 Hook 顺序严格一致，因此无需动态调整结构，链表的内存效率更高。

3. 闭包的代价
每个 Hook 的 setState 需通过闭包绑定到特定链表节点，可能产生内存开销，但 React 通过 Fiber 和调度机制优化性能。

## 简易实现

```javascript
let hooks = [];      // 全局链表（React 实际存储于 Fiber 节点中）
let currentIndex = 0; // 当前 Hook 的索引（React 通过链表遍历实现）

function useState(initialValue) {
  // 通过闭包捕获当前索引
  const index = currentIndex;

  // 初始化或读取已有状态
  if (hooks[index] === undefined) {
    hooks[index] = initialValue;
  }
  const state = hooks[index];

  // 定义状态更新函数：闭包保存当前索引
  const setState = (newValue) => {
    hooks[index] = newValue;
    // 触发组件重新渲染（React 中通过调度机制实现）
    scheduleRerender();
  };

  currentIndex++; // 移动到下一个 Hook
  return [state, setState];
}

// 组件渲染示例
function Component() {
  const [count, setCount] = useState(0); // Hook 0
  const [text, setText] = useState(""); // Hook 1
  // ...
}

// 每次渲染前重置索引
function scheduleRerender() {
  currentIndex = 0;
  render();
}
```
