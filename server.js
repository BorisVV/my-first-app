const http = require('http');
//Wire with backend/app.js
const app = require('./backend/app');

//The host will give the process otherwise get the 3000 path
//Use the localhost:3000 for development test
const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);

server.listen(port);

// The code below is to check that the console works - only
//console.log("Hello!");
