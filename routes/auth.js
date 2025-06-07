const express = require("express");
const router = express.Router();
const { signUpValidator } = require("../utils/validators");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const { authenticate } = require("../middleware/auth");
require("../config/config");


// new create request
router.post("/signup", async (req, res) => {

    if (req?.body) {

        try {

            if (signUpValidator(req)) {
                
                let saltRounds = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // generate random saltrounds between 8 - 12 to create unique password for every user. 

                let salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                // create a new instance of User model
                const user = new User({
                    firstName: req?.body?.firstName,
                    lastName: req?.body?.lastName,
                    emailId: req?.body?.emailId,
                    password: hashedPassword,
                    age: req?.body?.age,
                    gender: req?.body?.gender,
                    photoUrl: req?.body?.photoUrl,
                    about: req?.body?.about,
                    skills: req?.body?.skills
                });

                // save the data 
                await user.save({ runValidators: true });
                res.json({message:"user added successfully"});
            }
            else {
                throw new Error("Validation error");
            }
        }
        catch (err) {
            res.status(400).json({Error:"error in creating user : " + err.message});
        }
    }
    else {
        throw new Error("DATA_NOT_RECIEVED");
    }
});

// Authentication of user by email,password and ending back jwt token
router.post("/login", async (req, res) => {    

    console.log({INFO:"log in function called"});

    if (req?.body) {

        try {

            let user = await User.findOne({ emailId: req?.body?.emailId });

            if (!user) throw new Error("NO_USER_FOUND");

            if (user?.password) {

                let isValidPassword = await user.validatePassword(req?.body?.password);

                if (!isValidPassword) throw new Error("INVALID_LOGIN");

                if (isValidPassword) {

                    const token = await user.getJWT();

                    res.cookie("authorizationToken", token, { maxAge: CONFIG.COOKIE_EXPIRATION, httpOnly: true, sameSite: "Strict" });

                    let userData = { firstName: user.firstName, lastName: user.lastName, age: user.age, gender: user.gender, photoUrl: user.photoUrl, about: user.about, skills: user.skills };

                    res.json({message:"signin successful",user: userData});
                }
            }
            else {
                throw new Error("NO_USER_FOUND");
            }
        }
        catch (err) {
            res.status(400).json({Error: err.message});
        }
    }
    else {
        res.status(400).json({message:"REQUEST_BODY_REQUIRED"});
    }
});

// log out from application
router.post("/logout", authenticate, async (req, res) => {
    console.log({INFO:"logout function called"});
    res.clearCookie("authorizationToken");
    res.json({message:"logged out successfully..."});
});

module.exports = { router };