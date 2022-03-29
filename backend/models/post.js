const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true }, //You can add , default: "Hello"
  content: { type: String, required: true },
  imagePath: {type: String, require: true } //The path for images
});

module.exports = mongoose.model('Post', postSchema);
