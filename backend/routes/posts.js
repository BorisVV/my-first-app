const { count } = require('console');
const express = require('express');
const req = require('express/lib/request');
const multer = require("multer");

const checkAuth = require('../middleware/check-auth')

const router = express.Router();

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
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_YPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const Post = require('../models/post');

//  Post the list of posts
router.post('',
  checkAuth,
  multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  //const post = req.body; //This line was used before the mongodb
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(postCreated => {
    res.status(201).json({
      message: "Post added succesfully!",
      post: {
        //...postCreated, // This is equal to and should go above the id: postC...
                        //title: postCreated.title,
                        //content: postCreated.content,
                        //imagePath: postCreated.imagePath
        id: postCreated._id,
        title: postCreated.title,
        content: postCreated.content,
        imagePath: postCreated.imagePath
      }
    });
  });
});

router.put('/:id',
  checkAuth,
  multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath
  };
  Post.updateOne({_id: req.params.id}, post)
  .then((result) => {
    //console.log(result); //This displays information in the terminal
    res.status(200).json({message: "Post updated succesfully!"});
  });
});

//Get the posts or fetch
router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize; //query.pagesize needs to be all lowercase - sensitive
  const currentPage = +req.query.page; //query.page - all lowercase too.
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage-1)).limit(pageSize);
  }
  //Post.find() // This was modified because of paginator and if statement setup to
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
    }).then(count => {
       //console.log(documents);
    res.status(200).json({
      //message: "Posts fecthed succesfully!", // Use this line for testing/checking
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({message: "Post id not founded"});
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    res.status(200).json({message: "Post Deleted"});
    //console.log(result);
  });
});

module.exports = router;
