/**
 * @param {string} s
 * @return {boolean}
 */
var checkValidString = function(s) {
    let leftStack = [];
    let arsiaStack = [];
    let result = true;
    for(let i =0;i<s.length;i++) {
        const char = s[i];
        if(char === '(') {
            leftStack.push(i)
        } else if(char === '*') {
            arsiaStack.push(i)
        } else {
            if(leftStack.length) {
                leftStack.pop() 
            } else if(arsiaStack.length) {
                arsiaStack.pop()
            } else {
                result = false;
                break;
            }
        }
        
    }
    while (leftStack.length && asteriskStack.length) {
        const leftIndex = leftStack.pop();
        const asteriskIndex = asteriskStack.pop();
        if (leftIndex > asteriskIndex) {
            return false;
        }
    }
    return leftStack.length === 0;
};