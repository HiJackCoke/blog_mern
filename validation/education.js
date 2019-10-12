const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(date) {

    let errors = {};

    date.school = !isEmpty(date.school) ? date.school : '';
    date.degree = !isEmpty(date.degree) ? date.degree : '';
    date.major = !isEmpty(date.major) ? date.major : '';

    if(Validator.isEmpty(date.school)) {
        errors.school = 'school name is required';
    }

    if(Validator.isEmpty(date.degree)) {
        errors.degree = 'degree is required';
    }

    if(Validator.isEmpty(date.major)) {
        errors.major = 'major is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };

};

