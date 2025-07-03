/**
 * Alice 和 Bob 正在玩一个游戏。最初，Alice 有一个字符串 word = "a"。

给定一个正整数 k。

现在 Bob 会要求 Alice 执行以下操作 无限次 :

将 word 中的每个字符 更改 为英文字母表中的 下一个 字符来生成一个新字符串，并将其 追加 到原始的 word。
例如，对 "c" 进行操作生成 "cd"，对 "zb" 进行操作生成 "zbac"。

在执行足够多的操作后， word 中 至少 存在 k 个字符，此时返回 word 中第 k 个字符的值。

注意，在操作中字符 'z' 可以变成 'a'。

N次操作后，字符串长度是2的N次方
然后 0+0  1+1  1+1 1+2  1+1 + 1+2 + 1+2 + 1+3
a ab abbc abbcbccd

考虑的场景
	•	字符串或序列是由前一轮“变换+拼接”形成（如 Sierpinski 字典，某种 grammar expansion）
	•	结构长度快速指数增长，不允许完整展开
	•	查询第 k 个元素/字符
	•	问题描述中含有“每轮结构 += 变换结构”
	•	倒推能还原回上一轮结构或对应位置

递归回溯
 */

/**
 * @param {number} k
 * @return {character}
 */
function kthCharacter(k) {
  let ans = 0;

  while (k !== 1) {
    // 找到最大的 2^t，使得 2^t < k
    let t = 0;
    while (Math.pow(2, t + 1) < k) {
      t++;
    }

    // 如果 k 是 2 的幂，则 t--
    if (Math.pow(2, t) === k) {
      t--;
    }

    // 回溯 k 的前一半位置
    k -= Math.pow(2, t);
    ans++;
  }

  return String.fromCharCode('a'.charCodeAt(0) + ans);
}