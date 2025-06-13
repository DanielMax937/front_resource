function nSum(nums, n, target) {
    const res = [];
    // 排序，有大小，方便去重
    nums.sort((a,b) => a - b);

    function findNSum(start, n, target, path) {
        const len = nums.length;
        if(n<2 || len - start < n) return;

        if(n === 2) {
            let left = start, right = len - 1;
            while(left < right) {
                const sum = nums[left] + nums[right];
                if(sum === target) {
                    res.push([...path, nums[left], nums[right]]);
                    // 处理重复数字
                    while(left < right && nums[left] === nums[left+1])left++;
                    while(left < right && nums[right] === nums[right-1])right--;
                    left++;
                    right--;
                } else if(sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
         } else {
                for(let i = start; i < len - n + 1;i++) {
                    if(i > start && nums[i]===nums[i-1]) continue
                    findNSum(i+1, n-1, target-nums[i], [...path, nums[i]]);
                }
            }
        }
        findNSum(0, n, target, []);
        return res;
    }
