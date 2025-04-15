/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    let result = false;
    while(head) {
        if(head.visited) {
            result = true;
            break;
        } else {
            head.visited = true;
            head = head.next
        }
    }
    return result;
};