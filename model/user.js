const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        // validate(value){
        //     if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
        //         throw new Error('Invalid email');
        //     }
        // }
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("not a strong password " +value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender data is invalid" + value);
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.svgrepo.com/show/350417/user-circle.svg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Url" + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about"
    },
    skills: {
        type: [String],
        validate(value) {
            
            if (!Array.isArray(value)) {
                throw new Error("Skills should be an array" + value);
            }

            if (value.length === 0) {
                throw new Error("the array is empty "+value);
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;