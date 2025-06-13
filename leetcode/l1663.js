/**
 * 
 * @param {*} n 
 * @param {*} k 
 * @returns 
 * 解释：
 * 初始全是'a', 总和为n
 * 每次从最后往前修改一个字符，把它变成'a' + 加值
 * 确保尽量后面是大大字母，前面保留'a', 从而保证字典序最小
 */
function getSmallestString(n, k) {
    const chars = Array(n).fill('a');
    let remain = k - n;
    let i = n - 1;

    while(remain > 0) {
        const add = Math.min(25, remain);
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + add);
        remain -= add;
        i--;
    }

    return chars.join('');
}