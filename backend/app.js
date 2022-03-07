//const { Message } = require('@angular/compiler/src/i18n/i18n_ast');
const express = require('express');

const app = express(); //returns an express app
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Header", "Origin,  X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("api/posts", (req, res, next) => {
  console.log();
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


