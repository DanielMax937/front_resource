## reconcileChildren
1. 输入：父 Fiber 的 pendingProps.children（新的 React 元素树）
2. 上下文：当前父 Fiber 节点（workInProgress）及其对应的当前树（current，即上一次渲染的 Fiber 树）
3. 目标：生成新的子 Fiber 树，最大限度复用现有 Fiber 节点

### 判断协调模式
Mount 模式：无旧 Fiber 树，跳过 Diff 直接创建新 Fiber（副作用标记较少）
Update 模式：基于旧 Fiber 树和新的 React 元素进行 Diff 比较

### diff算法
React 采用 多轮遍历策略 优化性能：

第一轮：按索引遍历（处理顺序不变的节点）
规则：逐项比较新旧子节点（按数组索引顺序）
复用条件：key 相同且元素类型（type）相同
中断条件：遇到 key 不同或类型不同的节点（进入下一轮）

第二轮：处理非顺序变更（Key 匹配）
收集旧 Fiber：将剩余旧子节点存入 Map<key, oldFiber>
遍历新元素：
用 key（或 index 作为 fallback）在 Map 中查找匹配
找到匹配：复用 Fiber 节点，更新属性（标记 Update 副作用）
未找到匹配：创建新 Fiber（标记 Placement 副作用）
标记删除：Map 中剩余未匹配的旧 Fiber 加入删除列表（标记 Deletion 副作用）

第三轮：处理移动节点（优化渲染）
对复用节点跟踪位置变化
需要移动时标记 Placement 副作用（配合 React 的渲染引擎优化 DOM 操作）

### 节点操作
1. 复用节点
2. 新建节点
3. 删除节点
4. 位置移动

## 关键的优化策略
1. Key 的重要性：
唯一 Key 帮助 React 精确识别节点变化
无 Key 时默认使用索引，可能导致性能下降或状态错误

2. 提前退出优化：
同级节点类型不同时（如 <div> → <span>），直接销毁整棵子树

3. 懒创建策略：
仅当实际需要时才创建 DOM 节点（避免不必要的 DOM 操作）

## 总结
reconcileChildren 的本质是 通过高效的 Diffing 算法，最小化更新成本：
1. 复用优先：Key 和 Type 匹配时复用节点
2. 精准更新：通过副作用标记最小化 DOM 操作
3. 批处理：构建完整的 Fiber 链表供提交阶段使用
此过程是 React 高性能渲染的核心，理解其机制有助于优化复杂组件的渲染性能。




