const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('ok node=' + process.version + ' mongo=' + (process.env.MONGODB_URI ? 'set' : 'unset'));
}).listen(PORT, () => console.log('test running on ' + PORT));
