const express = require('express');
const router = express.Router();
const profileModel = require('../models/profile');
const userModel = require('../models/user');
const passport = require('passport');


const checkAuth = passport.authenticate('jwt', {session: false});


// @route   Get profile
// @desc    Get profile
// @access  Public
router.get('/', (req, res) => {

});

// @route   Get profile/:profileId
// @desc    Get detail profile
// @access  Private
router.get('/:profileId', checkAuth, (req, res) => {

});






// @route   Post profile
// @desc    create profile
// @access  Private
router.post('/', checkAuth, (req, res) => {

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    if(typeof req.body.skills !== 'undefined') {    //skills가 undefined가 아닐경우
        profileFields.skills = req.body.skills.split(',');
        //.split(',') 여러개 잇을경우 ,로 구분
    }

    profileModel
        .findOne({user : req.user.id})
        .then(profile => {
            // update
            if(profile) {
                profileModel
                    .findOneAndUpdate(
                        {user : req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .populate('user', ['name', 'avatar'])
                    .then(profile => res.json(profile))
                    .catch(err => res.json(err));
            }
            else{
                // new
                profileModel
                    .findOne({ handle : profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = 'that handle already exists';
                            return res.status(400).json(errors);
                        }
                        new profileModel(profileFields)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => res.json(err));

                    })
                    .catch(err => res.json(err));
            }

        })
        .catch(err => res.json(err));


});



module.exports = router;