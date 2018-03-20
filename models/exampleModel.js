//================ USER MODEL ======================

/*require mongoose*/
var mongoose = require('mongoose');

/*create new schema*/
var Schema = mongoose.Schema;

/*add the schema for user*/
var UserSchema = new Schema({

        user_id: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password : {
            type: String,
            required: true
        },
        name: {
            type:Array,
            required: false
        },
        profile: {
            my_lucky: Array,
            sex: Number,
            tickets : [
                {
                    "game": String,
                    "total": Number,
                    "win": Number
                }
            ]
        }

    },
    {timestamps: {createdAt: 'created_at'}}
);

/*create a model using the schema*/
var User = mongoose.model('User', UserSchema);

module.exports = User;