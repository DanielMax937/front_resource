/**
 * 和谐数组是指一个数组里元素的最大值和最小值之间的差别 正好是 1 。

给你一个整数数组 nums ，请你在所有可能的 子序列 中找到最长的和谐子序列的长度。

数组的 子序列 是一个由数组派生出来的序列，它可以通过删除一些元素或不删除元素、且不改变其余元素的顺序而得到。

题目只要求最大值和最小值差别为1，所以之后出现两个数，且不管什么顺序都不影响
所以统计频率即可

可以用的场景：
1. 子序列相关 优先考虑哈希表 + 筛选条件
2. 问“最长/最多/最大数量”的子集合 一般用计数 + 遍历组合
3. 差值为1/固定值的问题 可建立 num ↔ num+1 的配对
4. 不在乎具体顺序，只在乎组合长度 用频率统计简化问题

实际场景
1. 用户跃迁等级分布
2. 商品价格波动聚类


 */

function findLHS(nums) {
  const count = new Map();
  let maxLength = 0;

  // 统计每个数字出现的次数
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  // 遍历所有键，查找与其差为 1 的组合
  for (const [num, freq] of count.entries()) {
    if (count.has(num + 1)) {
      maxLength = Math.max(maxLength, freq + count.get(num + 1));
    }
  }

  return maxLength;
}