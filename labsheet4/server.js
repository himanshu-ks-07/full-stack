const http = require('http');
const url = require('url');

const students = [
  { id: 1, name: 'Rahul Sharma', course: 'CSE' },
  { id: 2, name: 'Priya Verma', course: 'ECE' },
  { id: 3, name: 'Aman Gupta', course: 'IT' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Node.js Server!');
  } else if (pathname === '/students') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  } else if (pathname.startsWith('/students/')) {
    const id = parseInt(pathname.split('/')[2]);
    const student = students.find(s => s.id === id);

    if (student) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(student));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Student not found' }));
    }
  } else if (pathname === '/search') {
    const keyword = parsedUrl.query.keyword || 'None';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ keyword }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Page Not Found</h1>');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});