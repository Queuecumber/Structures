var List = require('./list.js');

var Node = function (key, value)
{
    this.key = key;
    this.value = value;

    this.position = null;
};

var BinomialHeap = function ()
{
    this.trees = new List();
};

module.exports = BinomialHeap;
