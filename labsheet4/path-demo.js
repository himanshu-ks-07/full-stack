const path = require('path');

const filePath = '/home/user/data/report.pdf';

console.log('Directory Name:', path.dirname(filePath));
console.log('Base Name:', path.basename(filePath));
console.log('Extension Name:', path.extname(filePath));
console.log('Absolute Path:', path.resolve('relative/path/report.pdf'));