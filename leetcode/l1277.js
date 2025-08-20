/**
 * @param {number[][]} matrix
 * @return {number}
 */
function countSquares(matrix) {                 // 定义函数：统计全 1 正方形子矩阵的数量
  const m = matrix.length;                      // m：矩阵的行数
  const n = matrix[0].length;                   // n：矩阵的列数（假设至少一列）

  // dp[i][j] 表示：以 (i, j) 为“右下角”的最大全 1 正方形的边长
  const dp = Array.from({ length: m }, () => Array(n).fill(0)); // 创建 m×n 的 dp，初始全 0

  let total = 0;                                // 统计答案：所有 dp[i][j] 之和

  for (let i = 0; i < m; i++) {                 // 遍历每一行
    for (let j = 0; j < n; j++) {               // 遍历当前行的每一列
      if (matrix[i][j] === 1) {                 // 只有当前位置是 1，才可能形成正方形
        if (i === 0 || j === 0) {               // 第一行或第一列：没有上/左/左上可参考
          dp[i][j] = 1;                         // 边长只能是 1（单个方块）
        } else {                                 
          dp[i][j] = Math.min(                  // 取“上、左、左上”三个方向的最小 dp
            dp[i - 1][j],                       // 上方的最大边长
            dp[i][j - 1],                       // 左侧的最大边长
            dp[i - 1][j - 1]                    // 左上的最大边长
          ) + 1;                                // 再 +1，表示可以扩展成更大的正方形
        }
        total += dp[i][j];                      // 把该格贡献的正方形数累加进答案
      }                                         // 若 matrix[i][j] 为 0，则 dp 保持 0，不贡献
    }
  }

  return total;                                 // 返回所有全 1 正方形子矩阵的总数
}

// 凡是有二维二值矩阵，需要统计或找最大连续方形区域的场景，都可以用这个dp模板
// 图像处理，游戏和地图算法，数据分析和表格处理，地理信息系统，工程检测与质量控制