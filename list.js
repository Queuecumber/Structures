// Circular doubly-linked list

var Postion = function (element)
{
    this.next = null;
    this.prev = null;
    this.element = element;
};

var List = function ()
{
    this.head = null;
    this.size = 0;
};

List.prototype.add = function (element)
{
    var pos = new Position(element);

    if(this.size === 0) // Empty list
    {
        pos.next = pos;
        pos.prev = pos;
        this.head = pos;
    }
    else
    {
        var tail = this.head.prev;

        tail.next = pos;
        this.head.prev = pos;

        pos.next = this.head;
        pos.prev = tail;
    }

    this.size++;
};

List.prototype.remove = function (position)
{
    if(this.size === 0)
        throw new Error("Cannot remove from empty list");

    if(position === this.head)
        this.head = position.next;

    position.prev.next = position.next;
    position.next.prev = position.prev;

    position.next = null;
    position.prev = null;

    this.size--;

    if(this.size === 0)
    {
        this.head = null;
    }
};

List.prototype.at = function (index)
{
    if(i >= this.size)
        throw new Error("Index out of bounds");

    var it = this.iterator();
    for(var i = 0; i < index; i++)
    {
        it.next();
    }

    return it.current;
};

List.prototype.find = function (element, comparitor)
{
    if(comparitor === undefined)
        comparitor = function (a, b) { return a === b; };

    for(var it = this.iterator(); it.hasNext(); it.next())
    {
        if(comparitor(it.current.element, element))
            return it.current;
    }

    return null;
};

List.iterator = function ()
{
    var start = this.head;
    var started = false;

    return {
        current: start,

        next: function () { this.current = this.current.next; started = true; },

        hasNext: function () { return !(started && this.current === start);  }
    };
};

List.reverseIterator = function ()
{
    var start = this.head;
    var started = false;

    return {
        current: start,

        next: function () { current = current.prev; started = true; },

        hasNext: function () { return !(started && current === start);  }
    };
};

List.roundRobinIterator = function ()
{
    var start = this.head;

    return {
        current: start,

        next: function () { current = current.next; },

        hasNext: function () { return true; }
    };
};

List.reverseRoundRobinIterator = function ()
{
    var start = this.head;

    return {
        current: start,

        next: function () { current = current.prev; },

        hasNext: function () { return true; }
    };
};

module.exports = List;
