// 给你一个只包含三种字符的字符串，支持的字符类型分别是 '('、')' 和 '*'。请你检验这个字符串是否为有效字符串，如果是 有效 字符串返回 true 。

// 有效 字符串符合如下规则：

// 任何左括号 '(' 必须有相应的右括号 ')'。
// 任何右括号 ')' 必须有相应的左括号 '(' 。
// 左括号 '(' 必须在对应的右括号之前 ')'。
// '*' 可以被视为单个右括号 ')' ，或单个左括号 '(' ，或一个空字符串 ""。

var checkValidString = (str) => {
    const leftStack = []
    const astrStack = []
    for(let i = 0;i<str.length;i++) {
        const char = str[i]
        if(char === '(') {
            leftStack.push(i)
        } else if(char === '*') {
            astrStack.push(i)
        } else if(char === ')') {
            if(leftStack.length) {
                leftStack.pop()
            } else if(astrStack.length) {
                astrStack.pop()
            } else {
                return false
            }
        }
    }
      while (leftStack.length && astrStack.length) {
        const leftIndex = leftStack.pop()
        const starIndex = astrStack.pop()
        // 如果星号在左括号前面，不能匹配，失败
        if (starIndex < leftIndex) return false
    }

    return leftStack.length === 0;
}