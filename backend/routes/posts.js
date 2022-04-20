const express = require('express');
const PostController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

//  Post the list of posts
router.post('', checkAuth, extractFile, PostController.createPost);

// Update post - put is similar to fetch
router.put('/:id', checkAuth, extractFile, PostController.updatePost);

//Get all posts or fetch
router.get('', PostController.getPosts);

// Get one post
router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
