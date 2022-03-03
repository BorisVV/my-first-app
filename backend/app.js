const express = require('express');

const app = express(); //returns app

app.use((req, res, next) => {
  console.log('Frist middleware');
  next();
}); //Uses a middleware function

app.use((req, res, next) => {
  res.send('Hello from express');
}); //Uses a middleware function

//Wire with server.js as listener
module.exports = app;


