## 核心目标
1. 避免阻塞主线程：防止长时间任务导致页面卡顿（如渲染、计算）。
2. 优先级管理：高优先级任务（如用户交互、动画）优先执行，低优先级任务（如数据预加载）延后处理。
3. 任务可中断与恢复：通过 Fiber 架构实现任务的暂停与继续。

## React 调度器（Scheduler）
React 实现了自己的调度模块（称为 Scheduler），而非直接依赖 requestIdleCallback，原因包括：
兼容性与可控性：requestIdleCallback 的浏览器支持有限，且触发频率不稳定。
更细粒度控制：React 需要动态调整任务的优先级和调度策略。

### 优先级划分
React 内部定义了 5 种优先级（从高到低）：
1. Immediate：同步执行（如危险的 setState）。
2. UserBlocking：用户交互（如点击、输入）。
3. Normal：普通更新（默认优先级）。
4. Low：低优先级任务（可延迟）。
5. Idle：空闲时执行（如日志上报）。

2. 任务队列管理
+ 每个优先级对应一个任务队列。
+ 高优先级任务可“插队”到低优先级任务前执行。
+ 同一优先级的任务按“先进先出”处理。

```javascript
// 使用 unstable_runWithPriority 设置优先级
  React.unstable_runWithPriority(React.UserBlockingPriority, () => {
    setState({ clicked: true });
  });
```

## 任务入队
任务被添加到对应优先级的队列中。
调度器根据当前帧的剩余时间（通过 messageChannel 或 setTimeout 模拟）决定是否执行任务。

## 时间切片（Time Slicing）
将任务拆分为多个 5ms 左右的小块，防止长时间占用主线程。
每执行完一个时间片，检查是否有更高优先级任务需要处理。

## 中断与恢复
如果当前任务时间片用完，或有更高优先级任务到达，则暂停当前任务，记录进度（通过 Fiber 节点保存状态）。
空闲时从断点恢复任务。

## 与浏览器协作
1. 模拟 requestIdleCallback
React 使用 messageChannel 或 setTimeout 模拟“空闲时段”检测，而非直接依赖 requestIdleCallback：
messageChannel：通过宏任务在浏览器渲染后执行，更接近“空闲”时机。
动态调整时间片：根据设备性能（如帧率）调整时间片长度。

2. 帧率对齐
调度器会尝试在浏览器每一帧（通常 16.6ms）的布局与绘制完成后执行任务，避免与渲染冲突。

## 示例场景
用户输入触发高优先级更新：
点击按钮 → 任务标记为 UserBlocking → 立即中断低优先级任务 → 优先处理点击反馈。

大数据渲染：
列表渲染任务标记为 Low → 拆分为多个时间片 → 在空闲时段分批处理，避免卡顿。

并发模式（Concurrent Mode）：
启用并发模式后，React 自动根据交互动态调整优先级，例如：
```javascript
// 使用 startTransition 标记低优先级更新
import { startTransition } from 'react';

startTransition(() => {
  setState({ data: newData }); // 低优先级更新
});
```

### 帧率对齐
React 使用 requestAnimationFrame（rAF）与浏览器渲染周期对齐：
1. 监听渲染起点：在每帧开始时触发 rAF，记录当前时间作为帧的起点。
2. 计算时间预算：根据帧率（如 60Hz 的 16.6ms）计算本帧剩余可用时间（frameDeadline）

React 通过 MessageChannel（宏任务）在浏览器渲染后触发任务调度：
1. 渲染后执行：rAF 在布局和绘制前执行，而 MessageChannel 的宏任务会在渲染完成后触发。
2. 检查剩余时间：在宏任务中判断当前时间是否小于 frameDeadline，以决定是否执行任务。

阶段	执行内容	时间范围
1. 事件处理	处理用户输入（点击、滚动等）	0ms - 2ms
2. rAF 回调	执行 requestAnimationFrame 回调	2ms - 4ms
3. 浏览器渲染	布局（Layout）、绘制（Paint）	4ms - 12ms
4. 空闲时间	React 执行任务（通过 MessageChannel）	12ms - 16.6ms
5. 剩余时间不足	暂停任务，等待下一帧	超时则推迟

所谓的小任务就是一个fiber，所以如果一个fiber要插入超大内容，可以变成p标签的方式来解决