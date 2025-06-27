/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 * 有长度对齐法和双指针法
 * 长度对齐，那是因为相交后，他们的后续节点一定是一致的。如果可以右对齐
 * 双指针，那是因为唱着加起来的路一定是一样的长（两者和），所以直接通过设置切换节点的方式，来同步进行++
 * 
 * 何时考虑这类解法
 * 1. 题目出现两个或多个链表头节点
 * 2. 提到是否相交，第一个相互交点这类词汇
 * 3. 要求返回的是节点引用（不是值）
 * 4. 或者链表后面结构一致
 * 
    “双指针，对调头，一次走完 A+B”
    不比长度，不用 set，只走两遍自动对齐！
实际场景：
    只要你有两个过程、两条路径、两段轨迹，想要判断它们是否在某个点开始重合/共享资源，就可以类比成链表相交问题。
    时间线同步，任务流水线，数据结构共享（版本管理，用户行为路径，依赖检测等等）
 */
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let pA = headA;
  let pB = headB;

  while (pA !== pB) {
    // 如果走到底就换头继续走，否则继续向前
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }

  return pA; // 相交则为交点，不相交则为 null
}