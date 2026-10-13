const fs = require('fs');
const path = require('path');

const dirName = 'uploads';

if (!fs.existsSync(dirName)) {
  fs.mkdirSync(dirName);
  console.log(`Directory '${dirName}' created.`);
}

['file1.txt', 'file2.txt', 'file3.txt'].forEach(file => {
  fs.writeFileSync(path.join(dirName, file), '');
});
console.log('3 empty files created inside uploads.');

let files = fs.readdirSync(dirName);
console.log('Before deletion:', files);

fs.unlinkSync(path.join(dirName, 'file1.txt'));
console.log('file1.txt deleted.');

files = fs.readdirSync(dirName);
console.log('After deletion:', files);