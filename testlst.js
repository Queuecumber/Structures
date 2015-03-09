var List = require('./list.js');

var list = new List();

list.add(1);
list.add(2);
list.add(3);
list.add(5);
list.add(7);
list.add(9);

list.remove(list.find(9));
list.add(4, list.find(3));
list.remove(list.at(5));

var list2 = new List();

list2.add(10);
list2.add(15);
list2.add(12);

list.merge(list2);

for(var it = list.Iterator(); it.hasNext(); it.next())
{
    console.log(it.current.element);
}

console.log();

for(var it = list.ReverseIterator(); it.hasNext(); it.next())
{
    console.log(it.current.element);
}
