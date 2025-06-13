/**
 * 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。

题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

请 不要使用除法，且在 O(n) 时间复杂度内完成此题。

思考
1. 因为不能使用除法，也就是需要把自身之外的结果都存起来
2. 自身之外分为左边和右边
3. 所以对于每个数字，其左边的存储结果，在乘以右边的结果就是最终的结果
 */

function demo(arr) {
    const answer = new Array(arr.length).fill(1);
    for(let i=1;i<arr.length;i++){
        answer[i] = answer[i-1] * nums[i-1]
    }
    let right = 1
    // 下面开始计算右边乘积
    for(let i=arr.length - 1; i>=0; i--) {
        answer[i] *= right
        right *= nums[i]
    }
    return answer
}