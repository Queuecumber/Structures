var RedBlackTree = require('./redblack.js');

var rbt = new RedBlackTree();

rbt.insert(4);
rbt.insert(2);
rbt.insert(5);
rbt.insert(10);
rbt.insert(3);
rbt.insert(7);
rbt.insert(12);
rbt.insert(13);
rbt.insert(22);
rbt.insert(25);
rbt.insert(19);
rbt.insert(15);
rbt.insert(1);
rbt.insert(16);
rbt.insert(14);
rbt.insert(6);
rbt.insert(17);


rbt.debugPrint(rbt.root, 0);

console.log();

rbt.remove(4);
rbt.remove(14);
rbt.remove(7);
rbt.remove(25);
rbt.remove(16);
rbt.remove(13);

rbt.debugPrint(rbt.root, 0);

console.log();

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
