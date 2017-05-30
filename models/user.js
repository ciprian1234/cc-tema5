const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');


/* USER SCHEMA */
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
//create user model
const UserModel = mongoose.model('User', UserSchema);


function addUser(newUser, callback) {
  //hash newUser password and save user to DB
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

function comparePassword(inputPassword, hash, callback){
  bcrypt.compare(inputPassword, hash, (err, isMatch)=>{
    if(err) throw err;
    callback(null, isMatch);
  });
}

function getUserById(id, callback){
  UserModel.findById(id, callback);
}

function getUserByUsername(username, callback){
  const query = {username: username};
  UserModel.findOne(query, callback);
}


/* EXPORTS */
module.exports.UserModel = UserModel;
module.exports.addUser = addUser;
module.exports.comparePassword = comparePassword;
module.exports.getUserById = getUserById;
module.exports.getUserByUsername = getUserByUsername;
