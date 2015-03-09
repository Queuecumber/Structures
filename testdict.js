var Dictionary = require('./dictionary.js');

var dictionary = new Dictionary();

dictionary.add('Kurt Kobain', 'A');
dictionary.add('Peter Frampton', 'C');
dictionary.add('Weird Al', 'B+');
dictionary.add('June Pipinpableopsocopolis', 'A-');
dictionary.add('Karl Marx', 'F');
dictionary.add('M_RemoveMe', 'Null');

dictionary.remove('M_RemoveMe');

console.log('Grades in Alphabetical Order');
console.log('============================');
for(var it = dictionary.Iterator(); it.hasNext(); it.next())
{
    console.log('Name: %s, Grade: %s', it.current.key, it.current.value);
}
