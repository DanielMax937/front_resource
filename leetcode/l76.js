/**
给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。
注意：

对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
如果 s 中存在这样的子串，我们保证它是唯一的答案。
 

示例 1：

输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
示例 2：

输入：s = "a", t = "a"
输出："a"
解释：整个字符串 s 是最小覆盖子串。
示例 3:

输入: s = "a", t = "aa"
输出: ""
解释: t 中两个字符 'a' 均应包含在 s 的子串中，
因此没有符合条件的子字符串，返回空字符串。
 

提示：

m == s.length
n == t.length
1 <= m, n <= 105
s 和 t 由英文字母组成
 

进阶：你能设计一个在 o(m+n) 时间内解决此问题的算法吗？
 */

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var calcCharMap = function(t) {
    const targetCharMap = {}
    t.split("").forEach(element => {
        if(targetCharMap[element] !== undefined) {
            targetCharMap[element] += 1
        } else {
            targetCharMap[element] = 1
        }
    });
    return targetCharMap;
}

var check = function(subStrCharMap, targetCharMap) {
    let finded = true
    Object.keys(targetCharMap).forEach((key)=> {
        if(!subStrCharMap[key] || subStrCharMap[key] < targetCharMap[key]) {
            finded = false;
        }
    })
    return finded
}
var minWindow = function(s, t) {
    const targetCharMap = calcCharMap(t)

    let answerL = -1;
    let answerR = -1;
    let left = -1;
    let right = 0;
    const subStrMap = {}
    for(;right<s.length;right++) {
        let rightChar = s[right]
        if(subStrMap[rightChar] === undefined) {
            subStrMap[rightChar] = 1
        } else {
            subStrMap[rightChar] += 1
        }
        while(check(subStrMap, targetCharMap)) {
            if(answerL === -1) {
                answerL = left
                answerR = right
            } else if((right - left) < (answerR - answerL)){
                answerL = left
                answerR = right
            }
            let leftChar = s[left]
            if(subStrMap[leftChar]) {
                subStrMap[leftChar] -= 1
            }
            left += 1
        }
    }
    if(answerL === -1) {
        return ''
    } else {
        return s.substring(answerL, answerR+1)
    }
};

console.log(minWindow("ADOBECODEBANC", "BANC"))
// 第一次失败，跳过以下执行语句，在循环中用continue，return会把所有循环都跳出
// 第二次失败，判断两个对象是否一致出错，因为子字符串可能会大于目标，不应该用等于，应该是不存在，或者小于时，设置为false
// 突然发现前两次有逻辑bug，因为大于等于了，则会取第一次满足的，需要修改。改成判断是否小于当前result的长度，同时把result的去掉，因为要走所有子字符串
// 第三次失败，是在构造过程中，等长的subString需要动态变化，去除第一个字符，添加最后一个字符，然后判断是否满足目标字符串。同时，内部循环应该从目标字符串长度开始
// 真正的解法是遍历右的坐标，内部循环从左边开始，那么这里左边开始会是一个循环。我的解法是先固定目标的长度，然后从源找出所有的子字符串判断。官方解法是先判断当前长度是否有目标，没有则跳过，否则就当前长度进行缩短。这样left就不会重复了。
// 相比之下，官方是左右同时遍历，而我的则会重复遍历多出来的那一个字符
// 第四次失败，是因为有尝试缩短距离，但是失败没有重新设置
// 第五次失败，是把substr和substring这个弄错了，应该用substring
// 第六次失败，是因为内部有个依赖target length的循环，把他改成动态维护的map就行
// 第七次失败，是因为改成动态维护map后，需要在lIndex和rIndex变更时，修改map，其他rIndex要跳过第一次循环的修改map逻辑
// 第八次失败，是因为对滑动窗口本身理解错误
// 滑动窗口，右边界右长，满足时缩小左边界，不满足时，因为左边已经处理过了，即前面已经是满足的，是虽小左边界导致不满足，所以左边复用，继续增长右。然后再这个过程中找到最小最大值，即固定右值找到最小满足值
// 我的之前的解法的问题，一开始最大，然后缩小左边界的过程，然后歪打正着的通过right减一，来完成向左边遍历，然后由于长度一定比之前的要小，所以不会有错过。即对特定长度的字符串都进行了枚举。然后枚举值右进行左侧缩小。
// 第九次失败，是忘记在while循环里结束循环，肯定需要改动循环逻辑
// 第十次失败，是忘记substring方式，需要在正确的索引上加1
