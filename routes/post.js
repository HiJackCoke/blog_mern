const express = require('express');
const router = express.Router();
const postModel = require('../models/post');
const passport = require('passport');
const validatePostInput = require('../validation/post');

const checkAuth = passport.authenticate('jwt', {session : false});


// @route   GET post
// @desc    get all post
// @access  Public
router.get('/', (req,res) => {

   postModel
       .find()
       .then(docs => {
          res.status(200).json({
             msg : "successful get all post",
             count : docs.length,
             postInfo : docs
          })
       })
       .catch(err => res.json(err));
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



module.exports = router;