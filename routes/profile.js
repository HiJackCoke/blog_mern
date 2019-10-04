const express = require('express');
const router = express.Router();
const profileModel = require('../models/profile');
const passport = require('passport');
const validateProfileInput = require('../validation/profile');

const checkAuth = passport.authenticate('jwt', {session: false});


// @route   Get profile
// @desc    Get profile
// @access  Public
router.get('/', (req, res) => {

    profileModel
        .find()
        .populate('user', ['name', 'avatar'])
        .then(docs => {

            if(!docs) {
                res.status(400).json({
                   msg : "there are no profiles"
                });
            }
            res.status(200).json({
                msg : "successful find all profile",
                count : docs.length,
                profileInfo : docs
            });
        })
        .catch(err => res.json(err));
});

// @route   Get profile/:profileId
// @desc    Get detail profile
// @access  Private
router.get('/:profileId', checkAuth, (req, res) => {

    profileModel
        .findById({_id : req.params.profileId})
        .then(profile => {
            res.status(200).json({
                msg : "successful find detail profile",
                profileInfo : profile
            });
        })
        .catch(err => res.json(err));
});






// @route   Post profile
// @desc    create profile
// @access  Private
router.post('/', checkAuth, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

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



// @route   Get profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {

    const errors ={};
    profileModel
        .findOne({ handle : req.params.handle})
        .then(profile => {
            if(!profile) {
                errors.nopeProfile = 'there is no profile'
                return res.status(400).json(errors);
            }
            res.status(200).json({
               msg : "successful find the handle",
               handleInfo : profile
            });
        })
        .catch(err => res.json(err));
});
//삭제 숙제

module.exports = router;