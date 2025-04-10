// 由于斐波那契数存在递推关系，因此可以使用动态规划求解。动态规划的状态转移方程即为上述递推关系，边界条件为 F(0) 和 F(1)。
// var finb = function(n) {
//     if(n<=1) {
//         return n
//     }
//     else {
//         return finb(n-1) + finb(n-2)
//     }
// }

var fib = function(n) {
    if (n < 2) {
        return n;
    }
    let p = 0, q = 0, r = 1;
    // 「滚动数组思想」把空间复杂度优化成 O(1)
    for (let i = 2; i <= n; i++) {
        p = q;
        q = r;
        r = p + q;
    }
    return r;
};

console.log(finb(20))