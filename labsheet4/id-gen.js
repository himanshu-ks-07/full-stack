const { nanoid } = require('nanoid');

console.log('Generated 5 Unique IDs:');
for (let i = 1; i <= 5; i++) {
  console.log(`${i}. ${nanoid()}`);
}