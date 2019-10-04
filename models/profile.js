const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    handle : {
        type : String,
        required : true,
        max : 40
    },
    company : {
        type : String
    },
    website : {
        type : String
    },
    location : {
        type : String
    },
    status : {
        type : String,
        required : true
    },
    skills : {
        type : [String],
        required : true
    },
    bio : {
        type : String
    },
    githubusername : {
        type : String
    },
    experience : [
        {
            title : {
                type : String,
                required : true
            },
            company : {
                type : String,
                required : true
            },
            location : {
                type : String
            },
            from : {
                type : Date,
                required : true
            },
            to : {
                type : Date
            },
            current : {
                type : Boolean, //(true or false)
                default : false
            },
            description : {
                type : String
            }
        }
    ],
    education : [],
    social : {},
    date : {
        type : Date,
        default : Date.now
    }

});





module.exports = mongoose.model('profile', profileSchema);