const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateExperienceInput(date) {

    let errors = {};

    date.title = !isEmpty(date.title) ? date.title : '';
    date.company = !isEmpty(date.company) ? date.company : '';
    date.from = !isEmpty(date.from) ? date.from : '';

    if(Validator.isEmpty(date.title)) {
        errors.title = 'title is required';
    }

    if(Validator.isEmpty(date.company)) {
        errors.company =  'company is required';
    }

    if(Validator.isEmpty(date.from)) {
        errors.from = 'from is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };
};