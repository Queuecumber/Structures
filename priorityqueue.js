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

    var heap = new FibonacciHeap(elementComparitor(priorityComparitor));
    this.heap = heap;

    Object.defineProperty(this, 'size', {
        get: function () { return heap.size; },
        enumerable: true
    });
};

PriorityQueue.prototype.add = function (priority, value)
{
    var el = new Element(priority, value);
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
    return el;
};

PriorityQueue.prototype.merge = function (pq)
{
    this.heap.merge(pq.heap);
};

PriorityQueue.prototype.Muterator =  function ()
{
    var it = this.heap.Muterator();

    return {
        current: it.current,

        next: function () { it.next(); this.current = it.current; },

        hasNext: function() { return it.hasNext(); }
    };
};

module.exports = PriorityQueue;
