var RedBlackTree = require('./redblack.js');

var rbt = new RedBlackTree();

rbt.add(4);
rbt.add(2);
rbt.add(5);
rbt.add(10);
rbt.add(3);
rbt.add(7);
rbt.add(12);
rbt.add(13);
rbt.add(22);
rbt.add(25);
rbt.add(19);
rbt.add(15);
rbt.add(1);
rbt.add(16);
rbt.add(14);
rbt.add(6);
rbt.add(17);

rbt.remove(4);
rbt.remove(14);
rbt.remove(7);
rbt.remove(25);
rbt.remove(16);
rbt.remove(13);

for(var it = rbt.InorderIterator(); it.hasNext(); it.next())
{
    console.log(it.current.element);
}

console.log();

for(var it = rbt.PreorderIterator(); it.hasNext(); it.next())
{
    console.log(it.current.element);
}

console.log();

for(var it = rbt.PostorderIterator(); it.hasNext(); it.next())
{
    console.log(it.current.element);
}
