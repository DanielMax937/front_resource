function findKthLargest(nums, k) {
    const target = nums.length - k; // 转换为第 (n-k) 小
  
    function quickSelect(left, right) {
      if (left === right) return nums[left];
  
      const pivotIndex = partition(left, right);
  
      if (pivotIndex === target) {
        return nums[pivotIndex];
      } else if (pivotIndex < target) {
        return quickSelect(pivotIndex + 1, right);
      } else {
        return quickSelect(left, pivotIndex - 1);
      }
    }
  
    function partition(left, right) {
      const pivot = nums[right];
      let i = left;
      for (let j = left; j < right; j++) {
        if (nums[j] < pivot) {
          [nums[i], nums[j]] = [nums[j], nums[i]];
          i++;
        }
      }
      [nums[i], nums[right]] = [nums[right], nums[i]];
      return i;
    }
  
    return quickSelect(0, nums.length - 1);
  }

// 口诀
//   •	j 遍历，找比 pivot 小的
//   •	找到就往前放（和 i 交换）
//   •	i 永远指向“比 pivot 小区块的下一个位置”
//   •	遍历结束后，pivot 和 i 交换
//   •	返回 i，就是 pivot 的最终位置