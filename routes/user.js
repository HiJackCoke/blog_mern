const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');

// @route   GET user/test
// @desc    Tests users route
// @access  Public

router.get('/test', (req,res) =>{
   res.json({
       msg : "works"
   })
});


// @route   Post user/signup
// @desc    signup users route
// @access  Public

router.post('/signup', (req, res) => {

    userModel
        .findOne({email : req.body.email})
        .then(user =>{
            if(user) {
                return res.status(400).json({
                    msg : "email already exists"
                });
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
                                "asd123",
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


module.exports = router;