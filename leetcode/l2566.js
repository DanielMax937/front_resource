function demo(num) {
    let maxNum = num
    for(let i=0;i<=9;i++) {
        const regex = new RegExp(i, 'g');
        maxNum = Math.max(maxNum, parseInt(num.toString().replace(regex, 9)))
    }
    console.log(maxNum)

    let minNum = num
    for(let i=0;i<=9;i++) {
        const regex = new RegExp(i, 'g');
        minNum = Math.min(minNum, parseInt(num.toString().replace(regex, 0)))
    }
    console.log(minNum)
    return maxNum - minNum

}

console.log(demo(90))

// 位数越高影响越大，所以直接把最高非9的替换掉就是最大，最高非0替换掉，就是最小
// class Solution:
//     def minMaxDifference(self, num: int) -> int:
//         s = str(num)
//         mx = num
//         for c in s:
//             if c != '9':  # 第一个不等于 9 的字符
//                 mx = int(s.replace(c, '9'))  # 替换成 9
//                 break
//         mn = int(s.replace(s[0], '0'))  # 第一个不等于 0 的字符，替换成 0
//         return mx - mn
