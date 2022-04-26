
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Install third party package npm install --save bcrypt
const jwt = require('jsonwebtoken'); // Install third package npm install --save jsonwebtoken

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10,).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: 'User created',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: "User's email already exist"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  // If user is shows undefined in resust, add a global var
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) { // 401 Authentication error code.
      return res.status(401).json({
        message: 'User email not found',
      });
    }
    fetchedUser = user; // This is to make sure that the when user is called in the .then block. Change user to fetchedUser
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }
    // Use Json Web Token (JWT) package to return the token. Install the package npm install --save jsonwebtoken
    // If there is a problem fetching the user, use a global var in this scope.
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_KEY,
      { expiresIn: '1h'}
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  }).catch(err => {
    return res.status(401).json({
      message: 'Invalid authentication credentials!'
    });
  });
}
