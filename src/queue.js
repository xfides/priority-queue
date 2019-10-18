const MaxHeap = require('./max-heap.js');

class PriorityQueue {
  constructor(maxSize = 30) {
    this.maxSize = maxSize;
    this.heap = new MaxHeap();
    this.countOfNodes = 0;
  }

  push(data, priority) {
    if (this.countOfNodes < this.maxSize) {
      this.heap.push(data, priority);
      this.countOfNodes++;
    } else {
      throw new Error()
    }

  }

  shift() {
    if (this.countOfNodes == 0) {
      throw new Error()
    }
    this.countOfNodes--;
    return this.heap.pop();

  }

  size() {
    return this.countOfNodes;
  }

  isEmpty() {
    if (this.countOfNodes == 0) {
      return true
    }
    return false
  }
}

module.exports = PriorityQueue;
