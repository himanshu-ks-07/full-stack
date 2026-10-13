const fs = require('fs');

fs.writeFile('student.txt', 'Name: Himanshu\nRoll No: 123456\n', (err) => {
  if (err) throw err;
  console.log('1. File created and written.');

  fs.appendFile('student.txt', 'Course: Full Stack Web Development\n', (err) => {
    if (err) throw err;
    console.log('2. Course name appended.');

    fs.readFile('student.txt', 'utf8', (err, data) => {
      if (err) throw err;
      console.log('\n--- Student Content ---');
      console.log(data);

      fs.rename('student.txt', 'profile.txt', (err) => {
        if (err) throw err;
        console.log('4. File renamed to profile.txt');
      });
    });
  });
});