const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const User = require("../model/user");
const { updateValidator, passwordValidator } = require("../utils/validators");
const CommonMiddleware = require("../middleware/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// getOne user by req.user (viewing the profile of the user logged in).
router.get("/view", authenticate, async (req, res) => {

    try {
        let userId = req?.user?.id;

        let userProfile = await User.findById(userId);

        if (!userProfile) {
            throw new Error("NO USER FOUND");
        }

        if (userProfile) {
            res.send(userProfile);
        }
    }
    catch (err) {
        res.status(400).json({"Error" : err.message});
    }
});

// update an user by using id
router.patch("/edit", authenticate, async (req, res) => {

    console.log({ INFO: "update user called" });

    let userId = req?.user?.id;
    let updateData = req?.body;

    if (req?.body) {
        try {

            if (!updateValidator(req)) {
                throw new Error("Invalid edit request")
            }

            updateData.modifiedAt = new Date(Date.now()).toISOString();

            if (!userId) {
                throw new Error("User ID is required");
            }

            let user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true });

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.json({ user: user });
        }
        catch (err) {
            res.status(500).send("something went wrong " + err.message);
        }
    }
    else {
        res.status(400).send("DATA NOT RECEIVED");
    }
});

// forgot password
router.post("/forgotpassword", async (req, res) => {

    let mailOptions = {};

    let emailId, user, resetToken, resetLink, transporter;

    try {
        emailId = req?.body?.emailId;

        user = await User.findOne({emailId: emailId});

        if (!user) {
            throw new Error("User not found");
        }

        if (user) {

            resetToken = await user.getResetToken();

            resetLink = `http://localhost:4500/profile/resetpassword/${resetToken}`;

            console.log({ resetLink: resetLink });

            transporter = await CommonMiddleware.createTransporter();

            if (!transporter) {
                throw new Error("Error creating transporter....");
            }

            if (transporter) {

                mailOptions = {
                    from: `Asha Laxmi <anithaasha12@gmail.com>`,
                    to: "anithaasha12@gmail.com",
                    subject: "Password Reset Request",
                    text: `Click the link to reset your password: ${resetLink}`,
                    html: `<p>Click the button below to reset your password:</p><a href="${resetLink}" style="display: inline-block;padding: 10px 20px;font-size: 16px;color: #ffffff;background-color: #007bff;text-decoration: none;border-radius: 5px;">Reset Password</a>`
                };

                let sendMail = await CommonMiddleware.sendMail(transporter, mailOptions);

                if (!sendMail) {
                    throw new Error("Error sending email");
                }

                if (sendMail) {
                    res.status(200).json({ message: "Password reset link sent to your email" });
                }

            }
        }
    }
    catch (err) {
        res.status(400).send("Error " + err.message);
    }
});

// update password
router.patch("/resetpassword/:token", async (req, res) => {

    let token = req?.params?.token;
    let password = req.body?.password, saltRounds, salt;

    try {

        const userId = await jwt.verify(token, CONFIG.JWT_FORGOT_PASSWORD_KEY);

        const user = await User.findById(userId.id);

        if (!user) {
            throw new Error("user not found");
        }

        if (user) {

            if (passwordValidator(req)) {

                saltRounds = Math.floor(Math.random() * (12 - 8 + 1)) + 8;

                salt = await bcrypt.genSalt(saltRounds);

                const hashedPassword = await bcrypt.hash(password, salt);

                if (!hashedPassword) throw new Error("problem during hash!!");

                if (hashedPassword) {

                    user.password = hashedPassword;
                    user.modifiedAt = new Date(Date.now()).toISOString();
                    await user.save();

                    res.status(200).json({ message: "Password has been reset successfully" });
                }
            }
            else {
                throw new Error("enter a strong password");
            }
        }
    } catch (err) {
        res.status(400).send("error " + err.message);
    }

});

// delete user api
router.delete("/delete", async (req, res) => {

    try {

        let user = await User.findByIdAndDelete(req?.body?.id);

        if (!user) {

            res.send("user already deleted");
        } else {
            
            res.send("user deleted successfully");
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

module.exports = { router };