const fs = require('fs');

let content = '';
for (let i = 1; i <= 50; i++) {
  content += `Line ${i}: Testing Node.js streams chunk reading.\n`;
}

fs.writeFileSync('largefile.txt', content);

const readStream = fs.createReadStream('largefile.txt', { highWaterMark: 150 });

readStream.on('data', (chunk) => {
  console.log(`Received chunk of size: ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log('Stream reading completed.');
});