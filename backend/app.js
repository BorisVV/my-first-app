//const { Message } = require('@angular/compiler/src/i18n/i18n_ast');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRequests = require("./routes/posts");

const app = express(); //returns an express app

mongoose.connect("mongodb+srv://boirs:xgx3BSJAfRrLF7bI@cluster0.buqn3.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed!')
  });

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,  X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/posts/', postRequests);

//Wire with server.js as listener
module.exports = app;


