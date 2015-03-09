var PriorityQueue = require('./priorityqueue.js');

var queue = new PriorityQueue();

queue.add('A', 'Kurt Kobain');
queue.add('C', 'Peter Frampton');
queue.add('B+', 'Weird Al');
queue.add('A-', 'June Pipinpableopsocopolis');
queue.add('F', 'Karl Marx');

console.log('Students in Class Order');
console.log('============================');

while(queue.size > 0)
{
    var s = queue.remove();
    console.log('Name: %s, Grade: %s', s.value, s.priority);
}
