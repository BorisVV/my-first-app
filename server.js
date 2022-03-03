const http = require('http');

const server = http.createServer((req, res) => {
  res.end('This is my first response');
});

//The host will give the process otherwise get the 3000 path
//Use the localhost:3000 for development test
server.listen(process.env.PORT || 3000);

//console.log("Hello!");
