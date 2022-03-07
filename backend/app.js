//const { Message } = require('@angular/compiler/src/i18n/i18n_ast');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./models/post');

const app = express(); //returns an express app

mongoose.connect("mongodb+srv://boirs:xgx3BSJAfRrLF7bI@cluster0.buqn3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed!')
  })
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,  X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("api/posts", (req, res, next) => {
  //const post = req.body; //This line was used before the mongodb
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  res.status(201).json({message: "Post added sucdcessfullu"}); // There is no need to send a message, is optional.
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: "ffsdfsdad",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "fdjflfdsowe",
      title: "Second server-side post",
      content: "This is coming from the server!",
    }
  ];
  res.status(200).json({
    message: "Posts fecthed succesfully!",
    posts: posts
  });
});

//Wire with server.js as listener
module.exports = app;


