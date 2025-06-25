/**
 * 常用于解决数组或字符串中连续子序列的相关问题，输入通常是线性数据结构，要求找到一个连续的子串（最长，最短，最大，最小）,根据上述找到收缩窗口的时间点
 * 何时考虑：看到输入是数组或字符串，有子序列要求，模板是最多，最长，最短，包含，恰好，至多，最小
 * 性能：优化到O（N）
 * 实际场景：每个时间段内有数据，然后统计某个区间的数据，这样就是一个数组了
 * @param {*} s 
 * @returns 
 */
var lengthOfLongestSubstring = function(s) {
    let leftPtr = 0;
    const contains = new Set()
    let maxLength = 0;
    for(let i=0;i<s.length;i++) {
        const newChar = s[i];
        while (charSet.has(currentChar)) {
            // 从 Set 中移除左指针指向的字符
            charSet.delete(s[leftPtr]);
            // 将左指针向右移动一格
            leftPtr++;
        }
        contains.add(newChar)
        maxLength = Math.max(maxLength, i - leftPtr + 1);
    }
    return maxLength
};

console.log(lengthOfLongestSubstring('abcabcbb'))