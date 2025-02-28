/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    nums.forEach((num, index) => {
        if (index === 0) {
            pre = num;
            max = num;
        } else {
            pre = Math.max(pre + num, num);
            max = Math.max(max, pre);
        }
    })
    return max;
};

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
// 第一次失败，因为不适合用滑动窗口。滑动窗口无法动态选择起点和终点。最大子序和问题的解法需要根据子数组的和的正负情况动态选择起始和终止位置，而滑动窗口并不具备这样的能力。简单说，就是无法固定右边边界，你怎么知道加下一个值是否最大？所以第一次right就会无限+。
// 添加一个后的最大值，需要之前的最大值，以及添加后的所有以添加为结尾的子数组的最大值
// 1.	基础情况：对于 i = 0，显然 dp[0] = nums[0] 是正确的。
// 2.	归纳假设：假设 dp[k] 是正确的，即 dp[k] = max(dp[k-1] + nums[k], nums[k])。
// 3.	归纳步骤：证明 dp[k+1] = max(dp[k] + nums[k+1], nums[k+1]) 也是正确的。