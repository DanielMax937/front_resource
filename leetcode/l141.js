/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var trainningPlan = function(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const next = curr.next; // 先将下一个节点单独放出来，这时当前的curr.next可以设置新值
        curr.next = prev; // 放出来后设置更新，此时prev设置新值
        prev = curr; // 然后再把上一个节点更新，此时curr设置新值
        curr = next; // 
    }
    return prev;
};