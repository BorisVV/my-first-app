const express = require('express');
const req = require('express/lib/request');
const multer = require("multer");

const route = express.Router();

const MIME_YPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

//Get and store the image file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_YPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_YPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const Post = require('../models/post');

//  Post the list of posts
route.post('', multer(storage).single("image"), (req, res, next) => {
  //const post = req.body; //This line was used before the mongodb
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(postCreated => {
    res.status(201).json({
      message: "Post added succesfully!",
      postId: postCreated._id
    });
  });
});


route.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
  .then((result) => {
    //console.log(result); //This displays information in the terminal
    res.status(200).json({message: "Post updated succesfully!"});
  });
});

//Get the posts or fetch
route.get('', (req, res, next) => {
  Post.find()
  .then(documents => {
    //console.log(documents);
    res.status(200).json({
      message: "Posts fecthed succesfully!",
      posts: documents
    });
  });
});

route.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({message: "Post id not founded"});
    }
  });
});

route.delete("/:id", (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    res.status(200).json({message: "Post Deleted"});
    //console.log(result);
  });
});

module.exports = route;
