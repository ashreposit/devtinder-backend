const express=require("express");
const router=express.Router();
const User=require("../model/user");


// get all the users
router.get("/feed", async (req, res) => {

    try {
        let userData = await User.find();
        if (userData.length == 0) {
            res.status(404).send("no data found");
        }
        else {
            res.send(userData);
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

module.exports={router};