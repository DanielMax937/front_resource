/**
 * 按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。

每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。
 */

/**
 * @param {number} n
 * @return {string[][]}
 */

// var solveNQueens = function(n) {
//     const solutions = [];
//     const queens = new Array(n).fill(-1); 
//     const cols = new Set()
//     const dia1 = new Set()
//     const dia2 = new Set()
//     const row = new Array(n).fill(".")

//     function generateBoard() {
//         const board = [];
//         for(let i=0;i<n;i++) {
//             row[queens[i]] = 'Q'
//             board.push(row.join(""))
//             row[queens[i]] = '.'
//         }
//         return board
//     }

//     function main(row) {
//         if(row===n) {
//             const board = generateBoard()
//             solutions.push(board)
//         } else {
//             // 遍历这一行皇后放的位置
//             for(let i=0;i<n;i++) {
//                 if(cols.has(i) || dia1.has(row-i) || dia2.has(row+i)) {
//                     continue
//                 }
//                 queens[row]=i
//                 // 标记状态，这个状态和row五官
//                 cols.add(i)
//                 dia1.add(row-i)
//                 dia2.add(row+i)

//                 // 进入下一行，顺利会在最前等于n时检查完毕，插入结果到solutions
//                 main(row+1)
//                 // 一种可能性方式完成了，准备试下一列，要把之前尝试清空
//                 cols.delete(i)
//                 dia1.delete(row-i)
//                 dia2.delete(row+i)
//             }
//         }
//     }
//     main(0)
//     return solutions

// }
var solveNQueens = function(n) {
    const solutions = [];
    const queens = new Array(n).fill(-1);
    const row = new Array(n).fill(".");

    function generateBoard() {
        const board = [];
        for (let i = 0; i < n; i++) {
            row[queens[i]] = "Q";
            board.push(row.join(""));
            row[queens[i]] = ".";
        }
        return board;
    }

    function solve(row, columns, diagonals1, diagonals2) {
        if (row === n) {
            const board = generateBoard();
            solutions.push(board);
        } else {
            // console.log(n, columns, diagonals1, diagonals2)
            // console.log(1 << n) // 这个是2的n次方 - 1
            // 最后，使用 &（按位与）运算符将 (2^n - 1) 和 ~(columns | diagonals1 | diagonals2) 进行按位与操作。
            // 这一步的作用是：从所有列（2^n - 1）中，去除那些已经被占用的位置（columns、diagonals1、diagonals2），得到当前行可以放置皇后的列的掩码。
            // 使得所有低于第 n 位的位置都变为 1，也就是得到一个有 n 个连续的 1 的二进制数。
            let availablePositions = ((1 << n) - 1) & (~(columns | diagonals1 | diagonals2)); 
            console.log('all available', availablePositions.toString(2))
            while (availablePositions) {
                // x & (−x) 可以获得 x 的二进制表示中的最低位的 1 的位置；
                const position = availablePositions & -availablePositions;
                console.log("last postion", position.toString(2))
                // x & (x−1) 可以将 x 的二进制表示中的最低位的 1 置成 0。
                // 这里相当于下一个for循环，找到下一个位置
                availablePositions &= availablePositions - 1;
                // 这里开始没见回溯
                // 这里是找到了一个位置，然后放入皇后
                const column = Math.log2(position);
                queens[row] = column;
                // 列取并集，对角线取并集且左右移动一位
                // 这里直接使用更新后的状态，不用回溯
                solve(row + 1, columns | position, (diagonals1 | position) << 1, (diagonals2 | position) >> 1);
            }
        }
    }

    solve(0, 0, 0, 0);
    return solutions;
};


// 初始化n的二维数组
// 那一行只能有一个皇后
// 那一列只能有一个皇后
// 证明，必须一行的数量必须=1
// 假设大于1，则一行有两个，有矛盾
// 假设为0，则n-1行最多有n-1个皇后，此时空一行，所以只能放那一行
// 所以一定是一行一个

// 如果只有一个，则方案为1
// 如果有两个，则矛盾
// 如果有三个，则矛盾
// 回溯法

console.log(solveNQueens(4));

// 我们不知道用什么办法来枚举是最优的时候，可以从下面三个方向考虑：

// 子集（N次方）枚举，组合（数学组合）枚举，排列（数学排列）枚举。带入一些 n 进这三种方法验证，就可以知道哪种方法的枚举规模是最小的，这里我们发现第三种方法的枚举规模最小。这道题给出的两个方法其实和排列枚举的本质是类似的。

