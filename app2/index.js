var http = require('http');

var server = http.createServer(function (request, response) {
  response.writeHead(200);
  response.end('hello from app2');
});

server.listen(9001);
