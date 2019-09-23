const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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



module.exports = router;