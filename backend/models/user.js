const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // 3rd party package needs to be npm install --save

const userSchema = mongoose.Schema({
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

