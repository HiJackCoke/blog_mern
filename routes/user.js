const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/user');

const checkAuth = passport.authenticate('jwt', {session: false});
const validateRegisterInput = require('../validation/register');

// @route   GET user/all
// @desc    total data get
// @access  Public

//console.log는 개발자만 확인가능

router.get('/all', (req, res) => {

    userModel
        .find()
        .then(docs => {
          res.status(200).json({
              msg : "successful find all user data",
              count : docs.length,
              userInfo : docs
          });
        })
        .catch(err => res.json(err));
});

// @route   Post user/signup
// @desc    signup users route
// @access  Public

router.post('/signup', (req, res) => {

    const{errors, isValid} = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    };


    userModel
        .findOne({email : req.body.email})
        .then(user =>{
            if(user) {
                errors.msg = "email already exists";
                return res.status(400).json(errors);

                // return res.status(400).json({
                //     msg : "email already exists"
                // });
            }
            else {
                // avatar 생성
                const avatar = gravatar.url(req.body.email, {
                    s : '200',
                    r : 'pg',
                    d : 'mm'
                });

                const newUser = new userModel({
                    name : req.body.name,
                    email : req.body.email,
                    avatar,
                    password : req.body.password
                });
                //password 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.json(user);
                            })
                            .catch(err => {
                                res.json({
                                    errInfo : err
                                });
                            });
                    });
                });
            }
        })
        .catch(err => res.json(err));
});


// @route   Post user/login
// @desc    login users route
// @access  Public
router.post('/login', (req, res) => {
    // email 존재 여부 확인 in database
    // password 매칭
    // return jwt
    userModel
        .findOne({email : req.body.email})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    msg : "there is not email"
                });
            }
            else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {id: user.id, name: user.name, avatar: user.avatar};
                            //sign token
                            jwt.sign(
                                payload,
                                process.env.SECRECT_KEY,
                                {expiresIn: 9999},
                                (err, token) => {
                                  res.json({
                                    msg : "successful logIN",
                                    tokenInfo : 'bearer ' + token
                                  });
                                }
                            );
                        }
                        else {
                            res.status(400).json({
                               msg : 'password incorrect'
                            });
                        }
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
});


// @route   get user/current
// @desc    current users route
// @access  Private

router.get('/current', checkAuth, (req, res) => {

    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email
    });

});



module.exports = router;