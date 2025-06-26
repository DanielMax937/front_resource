/**
 * 
 * 可以使用的场景
 * 1. 子序列问题（是子序列而不是子串）
 * 2. 数值限制（子序列表示一个值）
 * 3. 限制不能超过一个阈值
 * 
 * 实际场景
 * 在资源限制下，从一个按位加权的集合中，选出最大数量的元素，使它们的总权重不超过限制。（如数据压缩，权限设计等等）
 * @param {*} s 
 * @param {*} k 
 * @returns 
 */
var longestSubsequence = function(s, k) {
    let sm = 0;
    let cnt = 0;
    let bits = Math.log2(k) + 1;
    for (let i = 0; i < s.length; i++) {
        const ch = s[s.length - 1 - i];
        if (ch === '1') {
            if (i < bits && sm + (1 << i) <= k) {
                sm += 1 << i;
                cnt++;
            }
        } else {
            cnt++;
        }
    }
    return cnt;
};