 Reconciliation（协调） 是框架在更新 UI 时高效比较新旧虚拟 DOM（Virtual DOM）差异的核心算法。它的核心目标是最小化对真实 DOM 的操作次数

## Reconciliation 的核心流程
协调过程分为两个阶段：
阶段一：渲染（Render Phase）
生成新虚拟 DOM：组件状态或 props 变化时，React 重新调用组件的 render 方法，生成新的虚拟 DOM 树。
Diffing 算法：比较新旧两棵虚拟 DOM 树的差异（称为 Diffing）。

阶段二：提交（Commit Phase）
更新真实 DOM：根据 Diffing 的结果，将差异应用到真实 DOM 上。

## Diffing 算法的具体策略
React 的 Diffing 算法基于以下假设进行优化，使得时间复杂度从 O(n³) 降低到 O(n)：

策略 1：同层比较（Tree Diff）
React 只会对同一层级的节点进行比较，不会跨层级追踪节点变化。
原因：跨层级移动节点的操作在 UI 中极少发生。如果发生，React 会直接卸载旧子树，创建新子树。

策略 2：组件类型不同时直接替换
如果新旧节点的组件类型不同（例如从 <div> 变为 <span>），React 会直接销毁旧组件及其子组件，创建新组件。
示例：从 <Button> 变为 <Input>，旧 Button 的 state 会被销毁。

策略 3：相同类型的组件或元素
如果新旧节点的类型相同：
DOM 元素（如 <div>）：React 仅更新变化的属性（如 className、style）。
组件（如 <MyComponent>）：保留组件实例，更新其 props，并触发生命周期方法（如 componentDidUpdate）。

策略 4：列表节点的 Key 优化
当处理子节点列表时，React 默认按顺序比较，可能导致低效更新（如列表头部插入元素）。
Key 的作用：通过为列表项添加唯一的 key，React 可以识别节点的唯一性，从而高效地重用或移动节点。
错误示例：用数组索引作为 key 可能导致状态错乱或性能问题（如删除中间项后索引变化）。

## React Fiber 架构
React 16 引入的 Fiber 架构 重构了协调过程，使其支持可中断的异步渲染，优化了复杂应用的性能：
增量渲染：将协调任务拆分为多个小任务（Fiber 节点），可中断并在浏览器空闲时恢复。
优先级调度：高优先级更新（如用户输入）可打断低优先级任务（如渲染长列表）。