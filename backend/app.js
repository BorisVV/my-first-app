//const { Message } = require('@angular/compiler/src/i18n/i18n_ast');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./models/post');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,  X-Requested-With, Content-Type, Accept');
  next();
});

//  Post the list of posts
app.post("/api/posts", (req, res, next) => {
  //const post = req.body; //This line was used before the mongodb
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save();
  
});

//Get the posts or fetch
app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      console.log(documents)
      res.status(200).json({
        message: "Posts fecthed succesfully!",
        posts: documents
    });
  });
});

app.delete("/api/post/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {console.log(result)});
  console.log(result);
  res.status(200).json({message: "Post Deleted"});
});

//Wire with server.js as listener
module.exports = app;


