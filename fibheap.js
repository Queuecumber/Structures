// Fibonacci Heap

var List = require('./list.js');

var Node = function (element)
{
    this.parent = null;
    this.children = new List();
    this.element = element;
    this.marked = false;
};

var nodeComparitor = function (comparitor)
{
    return function (a, b)
    {
        return comparitor(a.element, b.element);
    };
};

var FibonacciHeap = function (comparitor)
{
    if(comparitor === undefined)
    {
        comparitor = function (a, b)
        {
            if(a < b) return -1;
            if(a > b) return 1;
            if(a === b) return 0;
        };
    }
    this.comparitor = comparitor;

    this.roots = new List(nodeComparitor(comparitor));
    this.min = null;
    this.size = 0;
};

FibonacciHeap.prototype.add = function (element)
{
    var node = new Node(element);

    var pos = this.roots.add(node);

    if(this.min === null || this.comparitor(node.element, this.min.element.element) < 0)
    {
        this.min = pos;
    }

    this.size++;

    return node;
};

var updateMin = function ()
{
    var minPosition = this.roots.head;

    for(var it = this.roots.Iterator(); it.hasNext(); it.next())
    {
        if(this.comparitor(it.current.element.element, minPosition.element.element) < 0)
            minPosition = it.current;
    }

    this.min = minPosition;
};

var consolidate = function ()
{
    var ranks = new Array(45);

    var toDelete = [];
    for(var it = this.roots.Iterator(); it.hasNext(); it.next())
    {
        var rank = it.current.element.children.size;

        var minPosition = it.current;
        while(ranks[rank] !== undefined)
        {
            var oldMin = minPosition;

            minPosition = this.comparitor(ranks[rank].element.element, oldMin.element.element) < 0 ? ranks[rank] : oldMin;
            var maxPosition = minPosition === ranks[rank] ? oldMin : ranks[rank];

            minPosition.element.children.add(maxPosition.element);
            maxPosition.element.parent = minPosition.element;

            toDelete.push(maxPosition);

            ranks[rank] = undefined;
            rank = rank + 1;
        }

        ranks[rank] = minPosition;
    }

    toDelete.forEach(function (p)
    {
        this.roots.remove(p);
    }, this);
};

FibonacciHeap.prototype.deleteMin = function ()
{
    // Remove the old minimum
    var oldMin = this.min.element;
    this.roots.remove(this.min);

    // Merge the old mimimums children into the roots list
    this.roots.merge(oldMin.children);

    // Find the new minimum element
    updateMin.call(this);

    // Consolidate trees
    consolidate.call(this);

    this.size--;

    return oldMin.element;
};

var cut = function (node)
{
    var parent = node.parent;
    var childPosition = parent.children.find(node);

    parent.children.remove(childPosition);
    this.roots.add(node);
    node.parent = null;
    node.marked = false;

    // If the parent is a root node, take this opportunity to make sure it's unmarked
    if(parent.parent !== null)
    {
        // Otherwise, if it isn't marked, mark it
        if(!parent.marked)
        {
            parent.marked = true;
        }
        else // If it is marked, cut it
        {
            cut.call(this, parent);
        }
    }
    else
    {
        parent.marked = false;
    }
};

FibonacciHeap.prototype.decreaseKey = function (node, newElement)
{
    // Decrease the key and
    node.element = newElement;

    // If the heap order is violated, fix the heap
    if(node.parent !== null && this.comparitor(node.element, node.parent.element) < 0)
    {
        cut.call(this, node); // recursive cut
    }

    // Reset the min element if necessary
    if(node.parent === null && this.comparitor(node.element, this.min.element.element) < 0)
        this.min = this.roots.find(node);

    return node;
};

FibonacciHeap.prototype.merge = function (heap)
{
    this.roots.merge(heap.roots);

    if(this.comparitor(heap.min.element.element, this.min.element.element) < 0)
    {
        this.min = heap.min;
    }

    this.size += heap.size;
    heap.size = 0;
};

module.exports = FibonacciHeap;
