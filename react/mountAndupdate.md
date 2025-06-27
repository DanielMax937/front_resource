特性	首次渲染（Mount）	更新渲染（Update）
触发时机	组件首次插入 DOM	State/Props/Context 变化
DOM 操作	创建并插入全新 DOM 节点	复用现有 DOM，仅更新变化部分
状态初始化	初始化 state	使用现有 state（可能更新）
副作用执行	运行 useEffect 或 componentDidMount	先清理旧 effect，再运行新 effect
生命周期钩子	constructor, componentDidMount	shouldComponentUpdate, componentDidUpdate
性能影响	较重（需构建完整 DOM）	较轻（通过 Diffing 算法优化）
虚拟 DOM 作用	生成初始虚拟 DOM 树	对比新旧虚拟 DOM，计算最小更新