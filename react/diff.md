# React Diffing 机制：Stack Reconciler vs Fiber Reconciler
**核心目标相同：** 两者都是为了比较两棵 React 元素树（通常是当前渲染的树和新的由 `render` 方法返回的树），计算出最小的变更集，并高效地更新 DOM。

**根本差异：** Stack Reconciler 使用**同步递归深度优先遍历**，而 Fiber Reconciler 使用**基于链表的异步可中断迭代遍历**。

---

### 一、旧时代：Stack Reconciler (React 15 及之前)

1.  **触发时机：**
    *   状态更新 (`setState`) 或父组件重新渲染导致子组件更新时触发。
    *   **同步执行：** 一旦开始，就必须一次性完成整个组件树的协调和 DOM 更新，无法中断。如果组件树很大，会长时间阻塞主线程，导致卡顿、掉帧。

2.  **树的结构与遍历：**
    *   **虚拟 DOM 树：** 由 React 元素（`React.createElement` 的结果）构成的树形结构。
    *   **递归深度优先遍历：**
        *   从根节点开始。
        *   进入一个组件：调用其 `render` 方法，得到子组件的 React 元素。
        *   **递归处理子组件：** 对每个子元素重复上述过程，直到到达叶子节点（通常是原生 DOM 节点）。
        *   离开一个组件：此时该组件及其所有子组件的**完整新虚拟 DOM 树**已经生成。
    *   **比较（Diffing）：** 在递归“离开”的过程中（或者说，在生成新树的过程中），将**刚生成的新虚拟 DOM 子树**与**上一次渲染时保存的旧虚拟 DOM 子树**进行逐节点比较（Diff 算法）。
    *   **打补丁（Patching）：** 根据 Diff 的结果，**同步地、一次性**将计算出的所有 DOM 变更应用到真实 DOM 上。

3.  **关键特点：**
    *   **“栈”的隐喻：** JavaScript 调用栈深度代表了遍历的深度。递归调用将上下文（当前处理的组件、子节点索引等）压入调用栈。
    *   **不可中断：** 递归一旦开始，必须执行到完成栈清空。主线程在此期间被完全占用。
    *   **树级协调：** Diff 算法通常以组件为单位进行比较（启发式策略），但本质上是对两棵完整的树进行比较。
    *   **同步 DOM 更新：** 协调完成后，一次性同步更新 DOM。
    *   **问题：** 大型应用更新时容易造成 UI 卡顿，无法利用浏览器的空闲时间，难以实现高优先级更新插队（如动画响应）。

---

### 二、新时代：Fiber Reconciler (React 16+)

Fiber 架构的核心是引入了 **`Fiber` 节点**和 **`workLoop`** 的概念。

1.  **Fiber 节点是什么？**
    *   一个 JavaScript 对象，代表一个**工作单元**。
    *   对应一个 React 元素（组件实例、DOM 节点等）。
    *   关键属性：
        *   `type`: 组件类型或标签名。
        *   `key`: Diffing 的关键标识。
        *   `stateNode`: 关联的真实实例（类组件实例、DOM 节点、函数组件无）。
        *   `return` / `child` / `sibling`: 指针，构成**链表树结构**（不再是纯树形）。
        *   `pendingProps` / `memoizedProps`: 新的/上一次渲染使用的 props。
        *   `pendingWorkPriority` / `lanes`: 标识更新优先级（调度相关）。
        *   `effectTag`: 标记需要执行的副作用类型（如 `Placement`, `Update`, `Deletion`）。
        *   `nextEffect`: 指针，指向下一个有副作用的 Fiber 节点（形成**副作用链表**）。
        *   `alternate`: **指向另一棵树上的对应 Fiber 节点**（通常是 `current` 或 `workInProgress`）。这是实现**双缓存**的关键。

2.  **双缓存技术：**
    *   同时存在两棵 Fiber 树：
        *   **`current` 树：** 当前渲染到屏幕上内容对应的 Fiber 树。
        *   **`workInProgress` (WIP) 树：** 正在内存中构建的新 Fiber 树。
    *   更新开始时，React 基于 `current` 树创建（或复用）WIP 树。**协调过程发生在 WIP 树上**。
    *   当 WIP 树构建完成并准备好所有副作用后，React **交换** `current` 和 `workInProgress` 树的指针。此时 WIP 树成为新的 `current` 树，代表最新的 UI。
    *   **优势：** 在 WIP 树构建过程中，用户看到的始终是完整的 `current` 树，不会出现半成品状态。提交阶段（DOM 更新）非常快速，因为只是指针交换和应用副作用链表。

3.  **工作循环 (`workLoop`) 与 可中断性：**
    *   协调过程被分解成一个个小的**工作单元**（每个 Fiber 节点就是一个工作单元）。
    *   核心函数：`performUnitOfWork(fiber)` 和 `completeUnitOfWork(fiber)`。
    *   **迭代遍历：** 使用循环代替递归。使用 `nextUnitOfWork` 指针指向下一个待处理的 Fiber 节点。
        *   **“递”阶段 (`beginWork`)：** 从根节点开始，沿着 `child` 指针向下处理每个 Fiber 节点。主要工作：
            *   创建/复用子 Fiber 节点 (`reconcileChildren`)。
            *   打上 `effectTag`（如需要插入、更新、删除）。
            *   调用 Class 组件的 `render` 方法或执行 Function 组件本身。
            *   返回下一个要处理的子 Fiber（通常是第一个子节点）。
        *   **“归”阶段 (`completeWork`)：** 当一个 Fiber 节点没有子节点（或所有子节点都处理完毕），进入 `completeWork`。主要工作：
            *   创建 DOM 节点（对于 HostComponent）。
            *   收集副作用（将自身添加到父节点的副作用链表或根节点的副作用链表）。
            *   处理完当前节点后，检查 `sibling` 兄弟节点：
                *   如果有兄弟节点，将 `nextUnitOfWork` 设为兄弟节点，进入兄弟节点的“递”阶段。
            *   如果没有兄弟节点，则“归”到父节点 (`return`)，完成父节点的 `completeWork`。
    *   **可中断与恢复：**
        *   React Scheduler 控制 `workLoop` 的执行。
        *   浏览器有空闲时间时（通过 `requestIdleCallback` 或 `MessageChannel` 等机制模拟），Scheduler 将控制权交给 `workLoop` 处理一个或多个工作单元。
        *   当浏览器需要处理更高优先级任务（如用户输入、动画）或当前时间片用完时，Scheduler 可以**中断** `workLoop`，保存当前的 `nextUnitOfWork`。
        *   待更高优先级任务完成或浏览器再次空闲时，Scheduler 恢复 `workLoop`，从保存的 `nextUnitOfWork` 继续执行。
    *   **优先级：** 不同类型的更新（用户交互、数据加载）被赋予不同的优先级。高优先级更新可以中断低优先级更新的协调过程。

4.  **协调（Diffing）的具体位置：**
    *   Diffing 主要发生在 `beginWork` 阶段的 `reconcileChildren` 函数中。
    *   对于当前正在处理的 Fiber（父节点），React 会将其 `pendingProps.children`（新 React 元素集合）与旧子 Fiber 节点（`current.child`）进行比较。
    *   基于 `key` 和 `type` 进行匹配，决定是复用旧 Fiber、新建 Fiber 还是删除旧 Fiber。生成新的子 Fiber 链表挂载到 WIP 节点上。
    *   **关键：** Diffing 是**局部的**，发生在处理父 Fiber 节点时，比较其新旧子元素列表，生成新的子 Fiber 链表。**不再需要一次性生成和比较整棵完整的虚拟 DOM 树**。

5.  **提交阶段 (`commitRoot`)：**
    *   当整个 WIP 树的协调工作完成（没有 `nextUnitOfWork`），并且所有副作用都已收集到根节点的副作用链表中时，进入提交阶段。
    *   **同步执行且不可中断：** 此阶段会执行所有 DOM 更新（插入、移动、删除、属性更新）以及生命周期钩子（如 `componentDidMount`, `componentDidUpdate`）和 Effect Hook 的清理/执行函数。
    *   分为三个子阶段：
        *   `BeforeMutation`：调用 `getSnapshotBeforeUpdate`（如果适用）。
        *   `Mutation`：执行所有 DOM 变更。
        *   `Layout`：调用 `componentDidMount/Update` 和同步的 Effect Hook (`useLayoutEffect`) 回调。
    *   **完成后：** 将 `workInProgress` 树的根节点设置为新的 `current` 树（指针交换）。

---

### 三、关键对比总结

| 特性                 | Stack Reconciler (旧)                          | Fiber Reconciler (新)                                       |
| :------------------- | :--------------------------------------------- | :---------------------------------------------------------- |
| **数据结构**         | React 元素树 (树形结构)                        | Fiber 节点树 (链表树结构：`child`, `sibling`, `return`)     |
| **遍历方式**         | **同步递归深度优先遍历**                       | **异步迭代循环遍历** (`workLoop`, `beginWork`, `completeWork`) |
| **可中断性**         | **不可中断** (阻塞主线程)                      | **可中断/恢复/优先级调度** (利用空闲时间片)                 |
| **协调单位**         | 整棵（子）树                                   | **单个 Fiber 节点** (工作单元)                              |
| **Diffing 发生点**   | 递归“离开”组件时比较新旧完整子树               | `beginWork` 阶段调用 `reconcileChildren` **比较父节点的新旧子元素列表** |
| **DOM 更新时机**     | 协调完成后**同步、一次性**更新                 | 协调完成后在**提交阶段同步、一次性**更新 (基于副作用链表)   |
| **并发模式基础**     | 不支持                                         | **核心支持** (可中断、优先级、双缓存)                       |
| **副作用管理**       | 隐含在 Diff 结果中                             | 显式标记 (`effectTag`) 并收集成**链表** (高效提交)          |
| **内存管理**         | 每次更新生成完整新虚拟 DOM 树                  | **双缓存** (`current` & `workInProgress`)，复用 Fiber 节点  |
| **生命周期钩子调用** | 在递归过程中可能分散调用                       | 集中在**提交阶段** (`Mutation` & `Layout` 子阶段) 同步调用 |
| **性能瓶颈**         | 大型更新卡顿                                   | 极大改善大型应用流畅度，支持时间切片和 Suspense             |

---

### 四、为什么 Fiber 更好？

1.  **流畅性：** 可中断性避免了长时间阻塞主线程，使应用即使在大型更新时也能保持响应（如动画、用户输入）。
2.  **并发能力：** 为 Concurrent Mode (并发模式) 奠定了基础，支持高优先级更新插队、Suspense 等高级特性。
3.  **高效更新：** 通过链表结构、副作用链表和双缓存技术，DOM 更新更高效。
4.  **更细粒度控制：** 以 Fiber 节点为工作单元，使得调度和优化有更大的空间。

### 五、深入源码的关键点

如果你想在源码层面追踪：

1.  **启动更新：** `scheduleUpdateOnFiber` (ReactFiberWorkLoop.js)
2.  **工作循环：** `workLoopSync` / `workLoopConcurrent` (ReactFiberWorkLoop.js) -> `performUnitOfWork` -> `beginWork` (ReactFiberBeginWork.js) / `completeUnitOfWork` -> `completeWork` (ReactFiberCompleteWork.js)
3.  **协调子节点：** `reconcileChildren` (ReactFiberBeginWork.js) -> `reconcileChildFibers` (ReactChildFiber.js) - 这里是 Diff 算法的核心实现 (`reconcileSingleElement`, `reconcileChildrenArray` 等)。
4.  **双缓存与指针：** 注意 `alternate` 属性的使用和 `root.current` 指针的交换。
5.  **提交阶段：** `commitRoot` (ReactFiberWorkLoop.js) -> `commitRootImpl` -> 遍历副作用链表执行 DOM 操作 (`commitMutationEffects`, `commitLayoutEffects`)。

理解 Fiber 架构是一个渐进的过程，从理解链表遍历、双缓存、工作循环、优先级调度到具体的 Diff 算法和副作用处理。希望这个详细的对比能为你深入研究源码提供一个清晰的路线图！