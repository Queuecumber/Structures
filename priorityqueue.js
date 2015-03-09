// Meldable priority queue impl. with a fibonacci heap

var FibonacciHeap = require('./fibheap.js');

var Element = function (priority, value)
{
    this.priority = priority;
    this.value = value;
};

var elementComparitor = function (comparitor)
{
    return function (a, b)
    {
        return comparitor(a.priority, b.priority);
    };
};

var PriorityQueue = function (priorityComparitor)
{
    if(priorityComparitor === undefined)
    {
        priorityComparitor = function (a, b)
        {
            if(a < b) return -1;
            if(a > b) return 1;
            if(a === b) return 0;
        };
    }

    this.heap = new FibonacciHeap(elementComparitor(priorityComparitor));
    this.size = 0;
};

PriorityQueue.prototype.add = function (priority, value)
{
    var el = new Element(priority, value);
    this.size++;

    this.heap.add(el);
};

PriorityQueue.prototype.peek = function ()
{
    var el = this.heap.min.element.element;
    return el;
};

PriorityQueue.prototype.remove = function ()
{
    var el = this.heap.deleteMin();
    this.size--;
    return el;
};

PriorityQueue.prototype.merge = function (pq)
{
    this.heap.merge(pq.heap);
    this.size = this.heap.size;
};

module.exports = PriorityQueue;
