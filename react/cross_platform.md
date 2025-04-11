## 核心概念
1. 协调器（Reconciler）：负责计算组件树的状态变化（如虚拟DOM差异），不涉及具体平台操作。React 16引入的Fiber架构增强了协调器的可中断和优先级调度能力。

2. 渲染器（Renderer）：根据协调器的输出，执行平台相关的UI更新。例如，React DOM操作浏览器DOM，React Native调用原生组件。

## 目的
1. 跨平台支持：同一套React核心可适配不同平台（Web、移动端、命令行等）。
2. 关注点分离：核心专注于组件生命周期、状态管理，渲染器处理平台细节。
3. 可扩展性：开发者可针对新平台（如VR、桌面应用）自定义渲染器。

```javascript
const Reconciler = require('react-reconciler');
const hostConfig = {
  createInstance: (type, props) => { /* 平台节点创建 */ },
  // 其他方法...
};
const MyRenderer = Reconciler(hostConfig);
// 这里的renderer就是对应不同平台的ReactDOM，所以需要在hostConfig实现诸如appendChild的方法
```

## 工作流程
协调阶段：协调器生成Fiber树，标记副作用（如节点增删、属性更新）。
提交阶段：渲染器遍历副作用列表，调用宿主方法（如appendChild、commitUpdate）更新UI