const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required:true
    },
    emailId: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    modifiedAt:{
        type:Date,
        default:Date.now
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;