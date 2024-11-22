const express=require("express");
const router=express.Router();
const User=require("../model/user");
const {authenticate} = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");



//getting all the pending connection requests for the logged in user
router.get('/user/connections',authenticate,async (req,res)=>{
    try {
        
        let loggedInUser = req?.user?.id;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser,
            status : 'interested'
        });

        if(!connectionRequests){
            res.status(400).json({message: 'no pending connection requests'});
        }

        res.status(200).json({message: 'connection requests fetched successfully'});

    } catch (err) {
        res.status(404).send(err.message);
    }
});

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