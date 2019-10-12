const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    text : {
        type : String,
        required : true
    },
    name : {
        type : String,
    },
    avatar : {
        type : String
    },
    likes : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'users'
            }
        }
    ],
    comments : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                required : true
            },
            text : {
                type : String,
                required : true
            },
            name : {
                type : String
            },
            avatar : {
                type : String
            },
            date : {
                type : Date,
                default : Date.now
            }
        }
    ],
    date : {
        type : Date,
        default : Date.now
    }



});

module.exports = mongoose.model('post', postSchema);