const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');
const user = require('../models/user');

module.exports = function(passport) {
  let opts = {};
  opts.secretOrKey = config.secret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

  passport.use(new jwtStrategy(opts, (jwt_payload, done)=>{
    user.getUserById(jwt_payload._doc._id, (err, returnedUser)=>{
      if(err){
        return done(err, false);
      }
      if(returnedUser){
        return done(null, returnedUser);
      }
      else {
        return done(null, false);
      }

    });

  }));

}
