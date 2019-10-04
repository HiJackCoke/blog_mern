const jwtStrategy = require('passport-jwt').Strategy;
//
const ExtractJwt = require('passport-jwt').ExtractJwt;
//복호화
const userModel = require('../models/user');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRECT_KEY;

module.exports = passport => {
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            userModel
                .findById(jwt_payload.id)
                .then(user => {
                    if(user){
                      return done(null, user);
                    }
                    done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};