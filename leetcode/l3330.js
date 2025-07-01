/**
 * Alice 正在她的电脑上输入一个字符串。但是她打字技术比较笨拙，她 可能 在一个按键上按太久，导致一个字符被输入 多次 。

尽管 Alice 尽可能集中注意力，她仍然可能会犯错 至多 一次。

给你一个字符串 word ，它表示 最终 显示在 Alice 显示屏上的结果。

请你返回 Alice 一开始可能想要输入字符串的总方案数。

用递归，因为
1. 需要枚举所以路径（穷举性问题）
2. 每个位置需要多种处理方式（树结构）
3. 状态需要“带着走”，而递归天然能表达
4. 而且问题规模可控，不会导致递归暴炸
 */

var possibleStringCount = function(word) {
    let n = word.length, ans = 1;
    for (let i = 1; i < n; ++i) {
        if (word[i - 1] === word[i]) {
            ++ans;
        }
    }
    return ans;
};
