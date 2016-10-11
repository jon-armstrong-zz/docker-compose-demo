var http = require('http');

var server = http.createServer(function (request, response) {
    console.log('app2: '+request.method+' '+request.url);
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('hello from app2');
});

server.listen(9001);
