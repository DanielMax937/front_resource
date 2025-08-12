/**
 * 请你返回将 n 表示成一些 互不相同 正整数的 x 次幂之和的方案数。换句话说，你需要返回互不相同整数 [n1, n2, ..., nk] 的集合数目，满足 n = n1x + n2x + ... + nkx 。

由于答案可能非常大，请你将它对 109 + 7 取余后返回。

比方说，n = 160 且 x = 3 ，一个表示 n 的方法是 n = 23 + 33 + 53 。
 */

/**
 * 
 背包问题：判断合适不合适，01背包问题，加入能不能满足，涉及资源分配等等
 */

var numberOfWays = function(n, x) {
    const MOD = 1e9 + 7;
    const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    dp[0][0] = 1;
    for (let i = 1; i <= n; i++) {
        const val = Math.pow(i, x);
        for (let j = 0; j <= n; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= val) {
                dp[i][j] = (dp[i][j] + dp[i - 1][j - val]) % MOD;
            }
        }
    }
    return dp[n][n];
}
