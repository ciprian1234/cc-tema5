const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const config = require('../config/config');


//register
router.post('/register', (req, res, next) => {
  let newUser = new user.UserModel({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  //de validat inainte de a apela addUser

  user.addUser(newUser, (err, registeredUser) => {
    if(err){
      res.json( {success:false, msg:"Failed to register user!"});
    }
    else {
      res.json( {success:true, msg:"User registered succesfully!", user:registeredUser});
    }
  });

});


//autenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  user.getUserByUsername(username, (err, returnedUser)=>{
    if(err) throw err;
    if(!returnedUser){
      return res.json({success:false, msg:"User not found!"});
    }
    //user found
    user.comparePassword(password, returnedUser.password, (err, isMatch)=>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(returnedUser, config.secret, {expiresIn: 604800});
        //send token
        res.json({
          success: true,
          msg: "Succesfully logged in!",
          token: 'JWT ' + token,
          user: {
            id : returnedUser._id,
            name: returnedUser.name,
            username: returnedUser.username,
            email: user.email
          }
        }); //end comparePassword
      }
      else {
        res.json({success:false, msg:"Incorrect password!"});
      }
    });

  }); //end getUserByUsername
});


//profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


//validate
router.get('/validate', (req, res, next) => {
  res.send('validate');
});


/* EXPORT */
module.exports = router;
