React Context API 的实现机制基于其核心源码设计，结合 Fiber 架构的底层逻辑，主要涉及 Context 对象创建、Provider 注入与更新、Consumer 订阅与渲染等关键环节

## Context 对象创建

_currentValue 当前值
Provider 通过 _context 属性关联到 Context 对象自身；
Consumer 直接指向 Context 对象

## Provider 注入与更新

当 <Context.Provider value={newValue}> 更新时，React 在 Fiber 树的协调阶段（Reconciler/beginWork）执行以下步骤

更新上下文值：
调用 pushProvider 将新值 newValue 存入 context._currentValue，并压入 valueStack 栈（用于处理嵌套 Provider 的场景）。

比较新旧值：
使用 Object.is 对比新旧值，若不同则触发子树更新。若自定义了 _calculateChangedBits，则通过位运算（如 0b01 表示某个字段变化）优化判断逻辑715。

标记消费组件更新：
若值变化，调用 propagateContextChange 深度遍历子树，找到所有依赖该 Context 的 Fiber 节点（通过 fiber.dependencies 链表），为其添加更新优先级（lane），强制后续渲染阶段重新执行。

## Consumer 订阅与渲染

消费组件通过 useContext 或 <Consumer> 订阅 Context，其核心逻辑如下：615

注册依赖：
useContext 调用 readContext，将当前 Context 添加到当前 Fiber 的 dependencies 链表，记录观察的位（observedBits）。

读取当前值：
从 context._currentValue 获取最新值。在渲染阶段，React 通过 valueCursor 从栈顶获取最近的 Provider 值715。

触发重渲染：
当 Provider 值变化时，依赖该 Context 的 Fiber 被标记更新（mergeLanes），即使父组件通过 React.memo 或 shouldComponentUpdate 跳过更新，消费组件仍会重新渲染。

## Fiber
React 通过 valueStack 和 valueCursor 管理嵌套 Provider 的上下文值，确保在深度优先遍历 Fiber 树时，子组件能访问正确的上下文

渲染阶段（Render Phase）：遇到 Provider 时，调用 pushProvider 将旧值压栈，更新 context._currentValue。

提交阶段（Commit Phase）：完成渲染后，调用 popProvider 恢复父层级的上下文值。

## 总结
性能优化策略
浅比较与位运算：
默认通过 Object.is 比较 Provider 的 value，避免无效更新。若传递对象，需稳定引用（如 useMemo）或通过 _calculateChangedBits 自定义变化检测，减少重渲染范围。

选择性更新穿透：
Context 的更新机制绕过父组件的 bailout 逻辑（如 React.memo），确保依赖组件即使被包裹在优化组件中也能响应变化。

React Context API 的实现机制围绕 发布-订阅模型 和 Fiber 栈式管理 展开，核心在于：
Provider 注入值并标记更新，通过深度遍历通知消费组件。
Consumer 注册依赖并响应变化，即使父组件跳过渲染。
栈结构维护嵌套上下文，确保层级隔离与优先级传播。

## 任务调度与优先级控制

一、任务调度与优先级控制

通过 Lane 模型 为不同更新任务分配优先级，确保关键交互（如用户输入）优先处理，非紧急任务（如界面过渡）延后执行。
	•	紧急更新（Urgent updates）：用户点击、输入等交互行为，对应高优先级 Lane（如 SyncLane: 0b0000000000000000000000000000001）。
	•	过渡更新（Transition updates）：界面切换、数据加载等，对应低优先级 Lane（如 TransitionLane）。

二、优化渲染性能

减少页面阻塞

高优先级任务（如用户输入）直接触发同步渲染，低优先级任务通过时间切片（Time Slicing） 分批次执行，避免主线程长时间阻塞。

增量渲染

低优先级更新可被中断并重新调度，确保用户感知的高优先级操作始终流畅。

三、动态调整优先级

根据事件类型动态分配 Lane：
	•	用户交互事件（如 onClick） 触发高优先级更新。
	•	异步数据更新（如 useEffect） 默认使用较低优先级。

四、组合处理更新

通过 位运算 支持多优先级组合判断：
	•	合并更新：将多个 Lane 合并（如 0b01 | 0b10 = 0b11），表示需同时处理两类优先级任务。
	•	优先级筛选：通过 updateLanes & renderLanes 快速判断当前需处理的更新类型。

五、避免资源浪费
	•	中断机制：低优先级任务执行过程中若出现高优先级任务，立即中断并重新排队，减少无效渲染。
	•	批量更新：相同优先级的更新合并处理，降低重复渲染频率。


## 时间分片
1. 阻塞的是生产Fiber的过程，但是提交给DOM时一定是完整的
2. 时间分片是指将一个大的任务分割成多个小任务，每个小任务（5ms左右）执行完后，检查是否有更高优先级的任务需要执行，如果有则先执行更高优先级的任务，否则继续执行下一个小任务。这样可以保证高优先级任务的及时响应，同时也不会阻塞主线程，保证了页面的流畅性。
3. 每个任务执行完毕后，立即将主线程交给游览器，保证用户操作的及时响应，比如点击，输入
