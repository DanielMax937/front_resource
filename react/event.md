## 作用
合成事件是React对浏览器原生事件的跨浏览器包装，提供统一的API接口。无论用户使用Chrome、Firefox还是IE，事件的行为和属性都会保持一致。例如，event.preventDefault() 或 event.stopPropagation() 在所有浏览器中表现相同。

## 实现原理

1. 事件委托：React将所有事件委托到文档根节点（React 17之前是document，17之后是root DOM容器），而非直接绑定到具体DOM元素。这样减少了内存消耗，并支持动态绑定（如条件渲染的元素无需重新绑定事件）。

2. 插件系统：不同事件类型（如onClick、onChange）由对应的插件处理（如SimpleEventPlugin、ChangeEventPlugin）。插件负责生成合成事件对象，并提取原生事件信息。

## 事件池
17后已经废弃，不再使用事件池，每次事件触发都会创建新的合成事件对象。

事件池是React的优化策略，用于复用合成事件对象以减少内存分配。当事件触发时，React从池中取出对象并填充数据；事件回调执行完毕后，重置对象属性并放回池中供后续复用

## 为什么说能动态绑定
1. 在react根容器上为每种事件注册单个监听器
2. 动态分发，根据事件目标，找到对应的组件，调用对应的事件处理函数
3. 事件处理函数与组件的关系通过React的Fiber树动态维护

## 优势
React 的合成事件（Synthetic Event）系统通过事件委托实现所有事件的统一管理。无论组件是否挂载，事件监听器始终绑定在根节点（React 17+ 是应用根容器，React 16 是 document）。这意味着：

事件监听器数量固定：每种事件类型（如 click、change）在根节点上仅绑定一次。
动态事件处理：事件触发时，React 根据组件树状态动态决定调用哪个事件处理函数。

## 组件卸载时的行为
当组件卸载时（如通过条件渲染移除组件），React 会执行以下操作：
a. 事件处理逻辑解绑
Fiber 树更新：React 会从虚拟 DOM（Fiber 树）中移除该组件对应的节点。
事件分发过滤：事件触发时，React 会检查目标组件是否仍在 Fiber 树中。若组件已卸载，其事件处理函数不会被调用。

b. 根节点监听器保留
事件监听器不删除：根节点上的事件监听器（如 click 监听）仍存在，因为它们可能被其他组件使用。
内存无泄漏：由于事件处理函数与组件绑定，组件卸载后，这些函数会被垃圾回收（前提是没有其他引用）。

```javascript
// ReactDOMEventListener.js（简化）
function dispatchEvent(event) {
  const targetInst = getClosestInstanceFromNode(event.target);
  if (targetInst !== null && !isFiberMounted(targetInst)) {
    // 如果组件已卸载，跳过事件处理
    return;
  }
  // 调用有效组件的事件处理函数
  dispatchEventForPluginEventSystem(event, targetInst);
}
```

```javascript
// ReactFiberWorkLoop.js（简化）
function safelyDetachRef(fiber) {
  const ref = fiber.ref;
  if (ref !== null) {
    // 清除与 DOM 的关联
    fiber.ref = null;
    // 其他清理逻辑...
  }
}
```
