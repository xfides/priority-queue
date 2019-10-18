const Node = require('./node');

class MaxHeap {
  constructor() {
    this.root = null;
    this.parentNodes = [];
    this.lastProcessIndex = 0;
    this.heap = [];
    this.flag = 0;

  }

  push(data, priority) {

    let node = new Node(data, priority);

    this.insertNode(node);
    this.updateHeap();

    this.shiftNodeUp(node);

  }

  pop() {

    if (this.root == null) {
      return
    }

    let head = this.detachRoot();
    this.restoreRootFromLastInsertedNode(head);
    this.shiftNodeDown(this.root);
    return head.data
  }

  detachRoot() {
    if (this.heap.length == 1) {
      let head = this.root;
      this.root = null;
      this.parentNodes = [];
      this.lastProcessIndex = 0;
      this.heap = [];
      return head
    }

    let head = this.root;
    if (this.parentNodes.indexOf(head) !== -1) {
      this.parentNodes.splice(
          this.parentNodes.indexOf(head), 1
      )
    }

    this.root = null;
    return head

  }

  restoreRootFromLastInsertedNode(detached) {
    if (this.parentNodes.length == 0) {
      return
    }
    let lastItem = this.parentNodes[this.parentNodes.length - 1];

    let lastItemParent = lastItem.parent;
    if (!lastItemParent) {
      return
    }

    if (lastItemParent.left == lastItem) {
      lastItemParent.left = null;
    } else {
      lastItemParent.right = null;
    }

    let rootL = detached.left;
    let rootR = detached.right;

    lastItem.parent = null;
    lastItem.left = rootL;
    lastItem.right = rootR;

    if (rootL) {
      rootL.parent = lastItem;
    }
    if (rootR) {
      rootR.parent = lastItem;
    }

    this.root = lastItem;
    this.updateHeap();

  }

  size() {
    return this.heap.length
  }

  isEmpty() {
    if (this.heap.length == 0) return true;
    return false;
  }

  clear() {
    this.root = null;
    this.parentNodes = [];
    this.lastProcessIndex = 0;
    this.heap = [];
  }

  insertNode(node) {

    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap.indexOf(node) == -1) {
        this.heap.push(node);
        break;
      }

    }

    if (this.parentNodes.length == 0) {
      this.root = node;
      this.parentNodes.push(node);

      return
    }

    for (var i = 0; i < this.parentNodes.length; i++) {

      if (this.parentNodes[i].left == null) {
        this.parentNodes[i].appendChild(node);
        this.parentNodes.push(node);

        return;
      }
      if (this.parentNodes[i].right == null) {
        this.parentNodes[i].appendChild(node);
        this.parentNodes.push(node);

        this.parentNodes.splice(i, 1);
        return
      }

    }

  }

  updateHeap() {
    let self = this;
    self.heap = [];
    self.lastProcessIndex = 0;

    function createHeap() {

      if (self.heap.length === 0) {

        self.heap.push(self.root);
        if (self.root.left) {
          self.heap.push(self.root.left);
        } else {
          return self.heap;
        }
        if (self.root.right) {
          self.heap.push(self.root.right);
          self.lastProcessIndex++;
          createHeap(self.root.left);
        } else {
          return self.heap;
        }
      }

      let node = self.heap[self.lastProcessIndex];

      let indexNodeLeft = self.lastProcessIndex * 2 + 1;
      let indexNodeRight = self.lastProcessIndex * 2 + 2;

      if (node.left) {
        self.heap[indexNodeLeft] = node.left;
      } else {
        return self.heap;
      }

      if (node.right) {
        self.heap[indexNodeRight] = node.right;
        self.lastProcessIndex++;
        createHeap();
      } else {
        return self.heap;
      }

    };
    createHeap();
    this.parentNodes = this.heap.filter(function (node) {
      if (!node.right || !node.left) {
        return true;
      }
      return false
    });

  }

  shiftNodeUp(node) {

    if (node.parent === null) {
      this.root = node;
      this.updateHeap();
      return
    }

    if (node.parent.priority >= node.priority) {
      this.updateHeap();
      return
    }
    node.swapWithParent();
    this.shiftNodeUp(node)

  }

  shiftNodeDown(oldTopNode) {

    // --- 1 - no old top node at all
    if (!oldTopNode) {
      return;
    }

    // --- 2 - analize old top node
    let oldTopNodeP = oldTopNode.parent;
    let oldTopNodeL = oldTopNode.left;
    let oldTopNodeR = oldTopNode.right;

    // --- 3 - old top node is only one root node
    if (!oldTopNodeP && !oldTopNodeL) {
      this.root = oldTopNode;
      this.updateHeap();
      return;
    }

    // --- 4 - old top node is root with left child
    if (!oldTopNodeP && !oldTopNodeR) {

      // --- 3.1 - (swap)  top-root node priority < bottom node priority
      if (oldTopNode.priority < oldTopNodeL.priority) {
        oldTopNodeL.swapWithParent();
        this.root = oldTopNodeL;
        this.updateHeap();
        this.shiftNodeDown(oldTopNode);
        return;
      }

      // --- 3.2 - (no swap) top-root node priority >= bottom node priority
      if (oldTopNode.priority >= oldTopNodeL.priority) {
        this.root = oldTopNode;
        this.updateHeap();
        return;
      }

    }

    // --- 5 - old top node is root with 2 child
    if (!oldTopNodeP && oldTopNodeR) {

      let oldTopNodeChilds = [oldTopNodeL, oldTopNodeR];
      oldTopNodeChilds.sort((node1, node2) => {
        return node2.priority - node1.priority;
      });

      let childWithMaxPriority = oldTopNodeChilds[0];

      // --- 4.1 - (swap)  top-root node priority < bottom node priority
      if (oldTopNode.priority < childWithMaxPriority.priority) {
        childWithMaxPriority.swapWithParent();
        this.root = childWithMaxPriority;
        this.updateHeap();
        this.shiftNodeDown(oldTopNode);
        return;
      }

      // --- 4.1 - (swap)  top-root node priority >= bottom node priority
      if (oldTopNode.priority >= childWithMaxPriority.priority) {
        this.root = oldTopNode;
        this.updateHeap();
        return;
      }

    }

    // --- 6 - old top node is not root with no child
    if (oldTopNodeP && !oldTopNodeL) {
      this.updateHeap();
      return;
    }

    // --- 7 - old top node is not root with only left child
    if (oldTopNodeP && !oldTopNodeR) {

      // --- 7.1 - oldTopNode (no root) priority < left child priority
      if (oldTopNode.priority < oldTopNodeL.priority) {
        oldTopNodeL.swapWithParent();
        this.updateHeap();
        this.shiftNodeDown(oldTopNode);
        return;
      }

      // --- 7.2 - oldTopNode (no root) priority >= left child priority
      if (oldTopNode.priority >= oldTopNodeL.priority) {
        this.updateHeap();
        return;
      }

    }

    // --- 8 - old top node is not root with 2 childs
    if (oldTopNodeP && oldTopNodeR) {

      let oldTopNodeChilds = [oldTopNodeL, oldTopNodeR];
      oldTopNodeChilds.sort((node1, node2) => {
        return node2.priority - node1.priority;
      });

      let childWithMaxPriority = oldTopNodeChilds[0];

      // --- 8.1 - (swap)  top (no root) priority < bottom node priority
      if (oldTopNode.priority < childWithMaxPriority.priority) {
        childWithMaxPriority.swapWithParent();
        this.updateHeap();
        this.shiftNodeDown(oldTopNode);
        return;
      }

      // --- 8.2 - (no swap)  top (no root) priority >= bottom node priority
      if (oldTopNode.priority >= childWithMaxPriority.priority) {
        this.updateHeap();
        return;
      }

    }

  }
}


// h = new MaxHeap();
//
// h.root = new Node(0, 3);
// h.root.appendChild(new Node(1, 20));
// h.root.appendChild(new Node(2, 7));
// h.root.left.appendChild(new Node(3, 5));
//
// debugger;
//
// h.shiftNodeDown(h.root);



module.exports = MaxHeap;
