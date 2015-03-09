var RedBlackTree = require('./redblack.js');

var Element = function (key, value)
{
    this.key = key;
    this.value = value;
};

var elementComparitor = function (keyComparitor)
{
    return function (a, b)
    {
        return keyComparitor(
            a !== null ? a.key : null,
            b !== null ? b.key : null
        );
    };
};

var Dictionary = function (keyComparitor)
{
    if(keyComparitor === undefined)
    {
        keyComparitor = function (a, b)
        {
            if(a < b) return -1;
            if(a > b) return 1;
            if(a === b) return 0;
        };
    }

    var comparitor = elementComparitor(keyComparitor);

    this.tree = new RedBlackTree(comparitor);
};

Dictionary.prototype.add = function (key, value)
{
    this.tree.add(new Element(key, value));
};

Dictionary.prototype.get = function (key)
{
    var node = this.tree.find(new Element(key));

    if(node !== null)
        return node.element.value;
    else
        return null;
};

Dictionary.prototype.remove = function (key)
{
    var node = this.tree.remove(new Element(key));

    if(node !== null)
        return node.element.value;

    else
        return null;
};

Dictionary.prototype.Iterator = function ()
{
    var it = this.tree.InorderIterator();

    return {
        current: it.current !== null ? it.current.element : null,

        next: function ()
        {
            it.next();
            this.current = it.current !== null ? it.current.element : null;
        },

        hasNext: function ()
        {
            return it.hasNext();
        }
    };
};

module.exports = Dictionary;
