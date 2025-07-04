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
        unique: true, //when certain field is set as uniques,by default an index is generated which are unique.
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
        enum: {
            values: ['male', 'female', 'other'],
            message: `{VALUE} must be valid`
        }
        // validate(value) {
        //     if (!['male', 'female', 'other'].includes(value)) {
        //         throw new Error("Gender data is invalid" + value);
        //     }
        // }
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
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

            // if (value.length === 0) {
            //     throw new Error("the array is empty " + value);
            // }
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

// compound index created to reduce time when searching for a user using both the first and last name.
// userSchema.index({ firstName: 1, lastName: 1 });

// instance method for creating new jwt token 
userSchema.methods.getJWT = async function () {

    const user = this; //gets the instance(value) of the user while logging in

    const token = await jwt.sign({ id: user._id }, CONFIG.JWT_SECRET_KEY, { expiresIn: CONFIG.JWT_EXPIRATION });

    return token;
};

// instance method for comparing the password
userSchema.methods.validatePassword = async function (userPassword) {

    const user = this;

    let isValidPassword = await bcrypt.compare(userPassword, user?.password);

    return isValidPassword;
};

// instance method for getting jwt reset token 
userSchema.methods.getResetToken = async function () {

    let user = this;

    let verficationToken = await jwt.sign({ id: user._id }, CONFIG.JWT_FORGOT_PASSWORD_KEY, { expiresIn: CONFIG.JWT_FORGOT_PASSWORD_EXPIRATION });

    return verficationToken;
};


// pre save middleware to update the updatedAt 
userSchema.pre('save',function(){

    const user = this;
    
    user.updatedAt = new Date(Date.now()).toISOString();
});

const User = mongoose.model("user", userSchema);

module.exports = User;