const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true }, //You can add , default: "Hello"
  content: { type: String, required: true },
  imagePath: { type: String, require: true }, //The path for images
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }   // Make only authorized users to be able to edit his own post, and not the other posts from others.
});

module.exports = mongoose.model('Post', postSchema);
