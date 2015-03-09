// Circular doubly-linked list

var Position = function (element)
{
    this.next = null;
    this.prev = null;
    this.element = element;
};

var List = function (comparitor)
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
    this.head = null;
    this.size = 0;
};

List.prototype.add = function (element, position)
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
        if(position === undefined)
            position = this.head.prev;

        position.next.prev = pos;
        pos.next = position.next;

        position.next = pos;
        pos.prev = position;
    }

    this.size++;

    return pos;
};

List.prototype.merge = function (list)
{
    if(list.size > 0)
    {
        if(this.size === 0)
        {
            this.head = list.head;
            this.size += list.size;

            list.head = null
            list.size = 0;
        }
        else
        {
            var tail = this.head.prev;

            var lstTail = list.head.prev;

            tail.next = list.head;
            list.head.prev = tail;

            this.head.prev = lstTail;
            lstTail.next = this.head;

            this.size += list.size;

            list.head = null;
            list.size = 0;
        }
    }
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

    var it = this.Iterator();
    for(var i = 0; i < index; i++)
    {
        it.next();
    }

    return it.current;
};

List.prototype.find = function (element)
{
    for(var it = this.Iterator(); it.hasNext(); it.next())
    {
        if(this.comparitor(it.current.element, element) === 0)
            return it.current;
    }

    return null;
};

List.prototype.Iterator = function (start)
{
    if(start === undefined)
        start = this.head;

    var started = false;

    return {
        current: start,

        next: function () { this.current = this.current.next; started = true; },

        hasNext: function () { return !(started && this.current === start) && this.current !== null;  }
    };
};

List.prototype.ReverseIterator = function (start)
{
    if(start === undefined)
        start = this.head.prev;

    var started = false;

    return {
        current: start,

        next: function () { this.current = this.current.prev; started = true; },

        hasNext: function () { return !(started && this.current === start) && this.current !== null;  }
    };
};

List.RoundRobinIterator = function (start)
{
    if(start === undefined)
        start = this.head;

    return {
        current: start,

        next: function () { this.current = this.current.next; },

        hasNext: function () { return this.current !== null; }
    };
};

List.prototype.ReverseRoundRobinIterator = function (start)
{
    if(start === undefined)
        start = this.head.prev;

    return {
        current: start,

        next: function () { this.current = this.current.prev; },

        hasNext: function () { return this.current !== null; }
    };
};

module.exports = List;
