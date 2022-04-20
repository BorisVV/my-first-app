const express = require('express');
const multer = require("multer");
const Post = require('../models/post');
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

//  Post the list of posts
router.post('',
checkAuth,
multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  //const post = req.body; //This line was used before the mongodb
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(postCreated => {
    res.status(201).json({
      message: "Post added succesfully!",
      post: {
        id: postCreated._id,
        title: postCreated.title,
        content: postCreated.content,
        imagePath: postCreated.imagePath
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating a post failed"
    });
  });
});

// The put is similar to fetch
router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
    creator: req.body.userId
  };
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
  .then(result => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Post updated succesfully!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
});

//Get the posts or fetch
router.get('', (req, res, next) =>{
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
    res.status(200).json({
      //message: "Posts fecthed succesfully!", // Use this line for testing/checking
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
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
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  .then(result => {
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Post deleted succesfully!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
});

module.exports = router;
