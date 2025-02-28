/**
 * 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

 
示例 1：

输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
示例 2：

输入：intervals = [[1,4],[4,5]]
输出：[[1,5]]
解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
 

提示：

1 <= intervals.length <= 104
intervals[i].length == 2
0 <= starti <= endi <= 104
 */

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    const unimap = {}
    for(let i=0;i<intervals.length;i++) {
        const first = intervals[i][0];
        const last = intervals[i][1];
        if(unimap[first] === undefined) {
            unimap[first] = last;
        } else {
            unimap[first] = Math.max(unimap[first], last);
        }
    }
    const sortedKeyList = Object.keys(unimap).sort((a, b) => a - b);
    const result = [];
    let currentEnd = -Infinity;
    for(let i=0;i<sortedKeyList.length;i++) {
        
        const keyItem = sortedKeyList[i];
        const valueItem = unimap[keyItem];

        // 比当前区间最大值还大或者包含，这个区间就没用了
        if(currentEnd >= valueItem) {
            continue
        } else if(currentEnd < keyItem/1) {
            // 比当前区间最大值还小，可以加入
            result.push([keyItem/1, valueItem]);
            currentEnd = valueItem
        } else {
            // 在中间，需要合并
            const lastItem = result[result.length-1];
            lastItem[1] = valueItem;
            currentEnd = valueItem
        }
    }
    return result;
};

// 先按数组的第一个元素排序
// 排序过程中，通过map，即首个元素已存在，则更新其对应的后元素，此后，获取到一个排好序，且首字母无重叠的数组
// 遍历这个map的key
// 干的不错，1. 把思路写出来，可以暴力，不用先考虑优化 2. 写不出来就先把已有思路代码化 3. 代码过程中，可以先通过i=0来设置初始状态，然后逐步优化
// 不过漏了区间开始和结束相等的情况，后续要把极端情况都列出来

console.log(merge([[1,3],[2,6],[8,10],[15,18]]))
console.log(merge([[1,4],[4,5]]))
