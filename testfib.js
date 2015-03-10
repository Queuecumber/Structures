var FibonacciHeap = require('./fibheap.js');

var heap = new FibonacciHeap();
var heap2 = new FibonacciHeap();

var nodeMap = [];

heap.add(4);
heap.add(2);
heap.add(5);
nodeMap.push(heap.add(10));
heap.add(3);
heap.add(7);
heap.add(12);
heap.add(13);
nodeMap.push(heap.add(22));


heap2.add(25);
heap2.add(19);
nodeMap.push(heap2.add(15));
heap2.add(1);
heap2.add(16);
heap2.add(14);
heap2.add(6);
heap2.add(17);

heap2.deleteMin();

heap.decreaseKey(nodeMap[0], 1);
heap.decreaseKey(nodeMap[1], 20);
heap2.decreaseKey(nodeMap[2], 1);

heap.deleteMin();

heap.merge(heap2);

for(var it = heap.Muterator(); it.hasNext(); it.next())
{
    console.log(it.current);
}
