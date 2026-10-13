const http = require('http');
const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  res.end(`Active Port: ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});