const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt'); // Install third party package npm install --save bcrypt
const jwt = require('jsonwebtoken'); // Install third package npm install --save jsonwebtoken
const user = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10,) // npm install --save bcrypt
  .then(hash => {
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
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  // If user is shows undefined in resust, add a global var
  // let fetchedUser;
  User.findOne(
    { email: req.body.email }
  )
  .then(user => {
    console.log(user);
    if (!user) { // 401 Authentication error code.
      return res.status(401).json(
        { message: 'User email not found' }
      );
    }
    // fetchedUser = user; // This is to make sure that the when user is called in the .then block. Change user to fetchedUser
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    console.log(result);
    if (!result) {
      return res.status(401).json(
        { message: 'Password not found' }
      );
    }
    // Use Json Web Token (JWT) package to return the token. Install the package npm install --save jsonwebtoken
    const token = jwt.sign(
      { email: user.email, userID: user._id }, // If there is a problem fetching the user, use a global var in this scope.
      'secret_this_should_be_longer',
      { expiresIn: '1h' }
    );
    res.status(200).json(
      { token: token }
    );
  })
  .catch(err => {
    return res.status(401).json(
      { message: 'Login denied, check email and password', err}
    );
  })
});

module.exports = router;


