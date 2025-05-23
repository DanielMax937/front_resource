1. 问题的关键是解决cpu瓶颈和io瓶颈，而落到实现上，则需要将同步更新变为可中断的异步更新
2. react15没有scheduler，只能是一起更新，所以会导致页面卡顿
3. react16引入了scheduler，将更新任务分为不同的优先级，优先级高的任务会中断优先级低的任务，从而保证页面的流畅性
4. 任务调度与优先级控制
    1. 通过Lane模型为不同更新任务分配优先级，确保关键交互（如用户输入）优先处理，非紧急任务（如界面过渡）延后执行
        1. 紧急更新（Urgent updates）：用户点击、输入等交互行为，对应高优先级Lane（如SyncLane: 0b
        2. 过渡更新（Transition updates）：界面切换、数据加载等，对应低优先级Lane（如TransitionLane）
    2. 优化渲染性能
        1. 减少页面阻塞
            1. 高优先级任务（如用户输入）直接触发同步渲染，低优先级任务通过时间切片（Time Slicing）分批次执行，避免主线程长时间阻塞
        2. 增量渲染
            1. 低优先级更新可被中断并重新调度，确保用户感知的高优先级操作始终流畅
    3. 动态调整优先级
        1. 根据事件类型动态分配Lane
            1. 用户交互事件（如onClick）触发高优先级更新
            2. 异步数据更新（如useEffect）默认使用较低优先级
    4. 组合处理更新
        1. 通过位运算支持多优先级组合判断
            1. 合并更新：将多个Lane合并（如0b01 | 0b10 = 0b11），表示需同时处理两类优先级任务
            2. 优先级筛选：通过updateLanes & renderLanes快速判断当前需处理的更新类型
    5. 避免资源浪费
        1. 中断机制：低优先级任务执行过程中若出现高优先级任务，立即中断并重新排队，减少无效渲染
        2. 批量更新：相同优先级的更新合并处理，降低重复渲染频率
5. 时间分片
    1. 阻塞的是生产Fiber的过程，但是提交给DOM时一定是完整的
    2. 时间分片是指将一个大的任务分割成多个小任务，每个小任务（5ms左右）执行完后，检查是否有更高优先级的任务需要执行，如果有则先执行更高优先级的任务，否则继续执行下一个小任务。这样可以保证高优先级任务的及时响应，同时也不会阻塞主线程，保证了页面的流畅性
    3. 每个任务执行完毕后，立即将主线程交给游览器，保证用户操作的及时响应，比如点击，输入

### 代数效应
1. 代数效应是指将副作用（Side Effect）抽象为纯函数的数学概念，通过代数运算实现副作用的组合和复用
    + 更程序的角度讲，代数效应讲副作用从函数逻辑中分离，使函数关注点保持纯粹
    + 可以理解通过try catch来实现，然后通过调用栈来理解
    + js中有类似的实现，比如Generator，但是它不支持任务插入，因为插入后上下文就变了
    + react中引入了Fiber（纤程）来实现。（多说一句，Generator就是协程）
3. 代数效应的主要概念包括：
    1. 代数数据类型（Algebraic Data Type）：通过数据结构描述副作用的类型和组合方式
    2. 代数运算（Algebraic Operation）：通过函数描述副作用的操作和组合方式
    3. 代数律（Algebraic Law）：通过数学公理描述代数运算的性质和规则
4. 代数效应的应用场景包括：
    1. 状态管理：通过代数效应实现状态的组合和复用，提高状态管理的可维护性和可测试性
    2. 异步处理：通过代数效应实现异步操作的组合和复用，提高异步处理的可维护性和可测试性
    3. 错误处理：通过代数效应实现错误处理的组合和复用，提高错误处理的可维护性和可测试性
5. 代数效应的优势包括：
    1. 可组合性：通过代数运算实现副作用的组合和复用，提高代码的可维护性和可测试性
    2. 可扩展性：通过代数数据类型描述副作用的类型和组合方式，支持新的副作用类型的扩展
    3. 可变性：通过代数律描述代数运算的性质和规则，保证副作用的可变性和一致性
6. 代数效应的实现方式包括：
    1. 基于代数数据类型和代数运算的纯函数式编程
    2. 基于代数效应和代数律的函数式编程范式
    3. 基于代数效应和代数律的函数式编程语言（如Haskell、PureScript）
7. 代数效应的实践包括：
    1. 使用代数效应库（如fp-ts、monocle-ts）实现状态管理、异步处理、错误处理等功能
    2. 使用代数效应框架（如ZIO、Eff）实现复杂业务逻辑的组合和复用
    3. 使用代数效应编程范式（如Free Monad、Tagless Final）实现业务逻辑的抽象和解耦
8. 代数效应的未来发展包括：
    1. 代数效应在前端领域的应用：通过代数效应实现前端应用的状态管理、异步处理、错误处理等功能
    2. 代数效应在函数式编程领域的应用：通过代数效应实现函数式编程的副作用处理、错误处理、状态管理等功能
    3. 代数效应在编程语言领域的应用：通过代数效应实现编程语言的副作用处理、错误处理、状态管理等功能
9. 代数效应的挑战包括：
    1. 代数效应的理解和应用：代数效应是一种抽象的数学概念，需要理解其核心思想和实现方式
    2. 代数效应的实现和优化：代数效应需要通过代数数据类型和代数运算实现副作用的组合和复用
    3. 代数效应的应用和扩展：代数效应需要通过代数律描述代数运算的性质和规则，保证副作用的可变性和一致性

## Fiber
1. React15及之前，Reconciler采样递归的方式创建虚拟DOM，递归过程不能中断，如果层级深，那么递归会占用线程很多时间，造成卡顿
2. React16采用异步的可中断的更新，原先的虚拟DOM已经无法满足需求，所以采用了Fiber
3. 16之前的是stack Reconciler, 16之后的是Fiber Reconciler
4. 作为静态数据，每个Fiber对应一个React Element, 作为动态数据，Fiber保存了本次更新中该组件改变的状态，要执行的工作等等
5. Fiber属性分成三种
    + 作为静态数据结构的属性
    + 用于连接其他Fiber节点形成的Fiber
    + 作为动态的工作单元属性(调度优先级相关lanes， childLanes)



> 这里需要提一下，为什么父级指针叫做return而不是parent或者father呢？因为作为一个工作单元，return指节点执行完> completeWork（本章后面会介绍）后会返回的下一个节点。子Fiber节点及其兄弟节点完成工作后会返回其父级节点，所以用return指代父级节点。

## 双缓存
当我们用canvas绘制动画，每一帧绘制前都会调用ctx.clearRect清除上一帧的画面。
如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。
为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。
这种在内存中构建并直接替换的技术叫做双缓存。
React使用“双缓存”来完成Fiber树的构建与替换——对应着DOM树的创建与更新。

## Fiber树
1. React中最多同时存在两颗Fiber树，显示在屏幕上叫current Fiber，在内存中构建的叫workInProgress Fiber
2. current Fiber树中的节点叫做current fiber，workInProgress Fiber树中的节点叫做workInProgress fiber.  他们两个alternate互相连接
```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```
3. React应用根节点通过current指针在不同Fiber树切换，即当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。

### render过程
1. 首次执行ReactDOM.render会创建fiberRootNode（源码中叫fiberRoot）和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是<App/>所在组件树的根节点。之所以要区分fiberRootNode与rootFiber，是因为在应用中我们可以多次调用ReactDOM.render渲染不同的组件树，他们会拥有不同的rootFiber。但是整个应用的根节点只有一个，那就是fiberRootNode。
2. 在构建workInProgress Fiber树时会尝试复用current Fiber树中已有的Fiber节点内的属性，在首屏渲染时只有rootFiber存在对应的current fiber（即rootFiber.alternate）。
3. 已构建完的workInProgress Fiber树在commit阶段渲染到页面。
4. workInProgress Fiber 树在render阶段完成构建后进入commit阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为current Fiber 树。
5. Reconciler工作的阶段被称为render阶段。因为在该阶段会调用组件的render方法。
6. Renderer工作的阶段被称为commit阶段。就像你完成一个需求的编码后执行git commit提交代码。commit阶段会把render阶段提交的信息渲染在页面上。
7. render与commit阶段统称为work，即React在工作中。相对应的，如果任务正在Scheduler内调度，就不属于work。

## render
render阶段开始于performSyncWorkOnRoot或performConcurrentWorkOnRoot方法的调用。这取决于本次更新是同步更新还是异步更新。

```javascript
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```
可以看到，他们唯一的区别是是否调用shouldYield。如果当前浏览器帧没有剩余时间，shouldYield会中止循环，直到浏览器有空闲时间后再继续遍历。

workInProgress代表当前已创建的workInProgress fiber。

performUnitOfWork方法会创建下一个Fiber节点并赋值给workInProgress，并将workInProgress与已创建的Fiber节点连接起来构成Fiber树。

主要阶段就是递归

### 递阶段
首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用beginWork 方法。
该方法会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来。
当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

### 归阶段
在“归”阶段会调用completeWork处理Fiber节点。
当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段。
如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段。
“递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了。

## beginWork
beginWork的工作是传入当前Fiber节点，创建子Fiber节点
```javascript
unction beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    // ...省略
    case LazyComponent:
    // ...省略
    case FunctionComponent:
    // ...省略
    case ClassComponent:
    // ...省略
    case HostRoot:
    // ...省略
    case HostComponent:
    // ...省略
    case HostText:
    // ...省略
    // ...省略其他类型
  }
}
```
其中传参：
1. current：当前组件对应的Fiber节点在上一次更新时的Fiber节点，即workInProgress.alternate
2. workInProgress：当前组件对应的Fiber节点
3. renderLanes：优先级相关，在讲解Scheduler时再讲解

从双缓存机制一节我们知道，除rootFiber以外， 组件mount时，由于是首次渲染，是不存在当前组件对应的Fiber节点在上一次更新时的Fiber节点，即mount时current === null。
组件update时，由于之前已经mount过，所以current !== null。
所以我们可以通过current === null ?来区分组件是处于mount还是update。

基于此原因，beginWork的工作可以分为两部分：
update时：如果current存在，在满足一定条件时可以复用current节点，这样就能克隆current.child作为workInProgress.child，而不需要新建workInProgress.child。
mount时：除fiberRootNode以外，current === null。会根据fiber.tag不同，创建不同类型的子Fiber节点

## update过程
什么样的条件可以直接复用前一次更新的子Fiber，不需要新建子Fiber
1. oldProps === newProps && workInProgress.type === current.type，即props与fiber.type不变
2. !includesSomeLane(renderLanes, updateLanes)，即当前Fiber节点优先级不够，

## mount过程
如果不满足优化路径，进入到新建子Fbier过程，常见的FunctionComponent/ClassComponent/HostComponent/HostText 最终会进入到reconcilChildren方法

## reconcileChildren
1. 对于mount的组件，他会创建新的子Fiber节点
2. 对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成新Fiber节点

不论走哪个逻辑，最终他会生成新的子Fiber节点并赋值给workInProgress.child，作为本次beginWork返回值，并作为下次performUnitOfWork执行时workInProgress的传参。

值得一提的是，mountChildFibers与reconcileChildFibers这两个方法的逻辑基本一致。唯一的区别是：reconcileChildFibers会为生成的Fiber节点带上effectTag属性，而mountChildFibers不会。

![beginwork](https://react.iamkasong.com/img/beginWork.png)

## effectTag
我们知道，render阶段的工作是在内存中进行，当工作结束后会通知Renderer需要执行的DOM操作。要执行DOM操作的具体类型就保存在fiber.effectTag中

```javascript
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```
通过二进制表示effectTag，可以方便的使用位操作为fiber.effectTag赋值多个effect。

比如：fiber.effectTag = Placement | Update | Deletion
表示该fiber需要插入到页面中并更新，并删除。


## 插入操作
1. 我们知道，mount时，fiber.stateNode === null，且在reconcileChildren中调用的mountChildFibers不会为Fiber节点赋值effectTag。那么首屏渲染如何完成呢？
2. 针对第一个问题，fiber.stateNode会在completeWork中创建。
3. 第二个问题的答案十分巧妙：假设mountChildFibers也会赋值effectTag，那么可以预见mount时整棵Fiber树所有节点都会有Placement effectTag。那么commit阶段在执行DOM操作时每个节点都会执行一次插入操作，这样大量的DOM操作是极低效的。
4. 为了解决这个问题，在mount时只有rootFiber会赋值Placement effectTag，在commit阶段只会执行一次插入操作。

## completeWork
1. update时，Fiber节点已经存在对呀DOM节点，所以不需要生成DOM节点，需要做的主要时处理props，主要逻辑就是处理updateHostComponent
2. 在updateHostComponent内部，被处理完的props会被赋值给workInProgress.updateQueue，并最终会在commit阶段被渲染在页面上
3. mount时只会在rootFiber存在Placement effectTag。那么commit阶段是如何通过一次插入DOM操作（对应一个Placement effectTag）将整棵DOM树插入页面的呢？原因就在于completeWork中的appendAllChildren方法。
由于completeWork属于“归”阶段调用的函数，每次调用appendAllChildren时都会将已生成的子孙DOM节点插入当前生成的DOM节点下。那么当“归”到rootFiber时，我们已经有一个构建好的离屏DOM树。
4. 作为DOM操作的依据，commit阶段需要找到所有有effectTag的Fiber节点并依次执行effectTag对应操作。难道需要在commit阶段再遍历一次Fiber树寻找effectTag !== null的Fiber节点么？
这显然是很低效的。
为了解决这个问题，在completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在effectTag的Fiber节点会被保存在一条被称为effectList的单向链表中。
effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。
类似appendAllChildren，在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。
5. 在performSyncWorkOnRoot函数中fiberRootNode被传递给commitRoot方法，开启commit阶段工作流程

## commit阶段