const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const User = require("../model/user");
const { updateValidator } = require("../utils/validators");

// getOne user by req.user (viewing the profile of the user logged in).
router.get("/view", authenticate, async (req, res) => {

    try {
        let userId = req?.user?.id;

        let userProfile =await User.findById(userId);

        if (!userProfile) {
            throw new Error("NO USER FOUND");
        }

        if(userProfile){
            res.send(userProfile);
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// update an user by using id
router.patch("/edit", async (req, res) => {

    console.log({ INFO: "update user called" });

    let userId = req?.user?.userId;
    let updateData = req?.body;
    updateData.modifiedAt = new Date(Date.now()).toISOString();

    if (req?.body) {
        try {

            if(!updateValidator(req?.body)){
                throw new Error("Invalid edit request")
            }

            if (!userId) {
                throw new Error("User ID is required");
            }

            let user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true });

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.json({user:user});
        }
        catch (err) {
            res.status(500).send("something went wrong" + err.message);
        }
    }
    else {
        res.status(400).send("DATA NOT RECEIVED");
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