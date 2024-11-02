const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("not a strong password " + value);
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
                throw new Error("the array is empty " + value);
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

userSchema.methods.getJWT = async function () {

    const user = this; //gets the instance(value) of the user while logging in

    const token = await jwt.sign({ id: user._id }, CONFIG.JWT_SECRET_KEY, { expiresIn: CONFIG.JWT_EXPIRATION });

    return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
    const user = this;

    let isValidPassword = await bcrypt.compare(userPassword, user?.password);

    return isValidPassword;
};

userSchema.methods.getResetToken = async function () {

    let user = this;

    let verficationToken = await jwt.sign({ id: user._id }, CONFIG.JWT_FORGOT_PASSWORD_KEY, { expiresIn: CONFIG.JWT_FORGOT_PASSWORD_EXPIRATION });

    return verficationToken;
};

const User = mongoose.model("user", userSchema);

module.exports = User;