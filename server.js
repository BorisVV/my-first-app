
//Wire with backend/app.js
const app = require('./backend/app');
const debug = require("debug")("node-angular");
const http = require('http');
//const { debug } = require('console');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe" + addr : "port" +port;
  switch(error.code) {
    case "EACCES":
      console.error(bind + " requires elevated priviliges");
      console.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;

    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("Listening", onListening);
server.listen(port);

//The host will give the process otherwise get the 3000 path
//Use the localhost:3000 for development test
//const port = process.env.PORT || 3000;
//app.set('port', port);
//const server = http.createServer(app);

//server.listen(port);

// The code below is to check that the console works - only
//console.log("Hello!");
