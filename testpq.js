var PriorityQueue = require('./priorityqueue.js');

var queue = new PriorityQueue();

queue.add('A', 'Kurt Kobain');
queue.add('C', 'Peter Frampton');
queue.add('B+', 'Weird Al');
queue.add('A-', 'June Pipinpableopsocopolis');
queue.add('F', 'Karl Marx');

console.log('Students in Class Order');
console.log('============================');

for(var it = queue.Muterator(); it.hasNext(); it.next())
{
    console.log('Name: %s, Grade: %s', it.current.value, it.current.priority);
}
