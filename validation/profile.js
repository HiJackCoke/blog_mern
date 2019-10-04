const Validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validateProfileInput(data) {

    let errors = {};
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, {min : 2, max : 40})) {
        errors.handle = 'handles need to between 2 and 40 characters';
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'profile handle is required';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'profile statue is required';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'profile skills is required';
    }

    if(!isEmpty(data.website)) {
        if(!Validator.isURL(data.website)) {
            errors.website = 'not a valid URL';
        }
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };

};

