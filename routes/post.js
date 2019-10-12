const express = require('express');
const router = express.Router();
const postModel = require('../models/post');
const profileModel= require('../models/profile');
const passport = require('passport');
const validatePostInput = require('../validation/post');

const checkAuth = passport.authenticate('jwt', {session : false});


// @route   GET post
// @desc    get all post
// @access  Public
router.get('/', (req,res) => {

   postModel
       .find()
       .sort({date : -1}) //최신순으로 정열해줌
       .then(docs => {
          res.status(200).json({
             msg : "successful get all post",
             count : docs.length,
             postInfo : docs
          })
       })
       .catch(err => res.json(err));
});


// @route   GET post/:postId
// @desc    get detail post
// @access  Public
router.get('/:postId', (req,res) => {
   postModel
       .findById(req.params.postId)
       .then(doc => {
          res.status(200).json({
             msg : "successful get detail post",
             postInfo : doc
          });
       })
       .catch(err => res.json(err))

});





// @route   POST post
// @desc    register post
// @access  Private

router.post('/', checkAuth, (req, res)=> {

   const {errors, isValid} = validatePostInput(req.body);

   if(!isValid) {
      return res.status(400).json(errors);
   }

   const newPost = new postModel({
      text : req.body.text,
      name : req.user.name,
      avatar : req.user.avatar,
      user : req.user.id
   });

   newPost
       .save()
       .then(post => {
          res.json(post);
       })
       .catch(err => res.json(err))

});



// @route   DELETE post/:postId
// @desc    delete post
// @access  Private
router.delete('/:postId', checkAuth, (req, res) => {
   profileModel //profileModel에서는 user의 id를 참조 하기떄문에 findOne, userModel에서는 id를 바로 참조하기 떄문에 findById
       .findOne({user: req.user.id})
       .then(profile => {
          postModel
              .findById(req.params.postId)
              .then(post => {
                 //check for post owner
                 if(post.user.toString() !== req.user.id) {
                    return res.status(400).json({
                       msg : "user not authorize"
                    })
                 }
                 else {
                    post
                        .remove()
                        .then(() => res.json({success: true}));
                 }
              })
              .catch(err => res.json(err));
       })
       .catch(err => res.json(err));
});


module.exports = router;