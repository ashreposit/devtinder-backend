const express=require("express");
const router=express.Router();
const User=require("../model/user");
const {authenticate} = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");

const POPULATE_USER_DATA ="firstName lastName age gender photoUrl about skills";

//getting all the pending connection requests for the logged in user
router.get('/request/received',authenticate,async (req,res)=>{
    try {
        
        let loggedInUser = req?.user?.id;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser,
            status : 'interested'
        }).populate("fromUserId",POPULATE_USER_DATA);

        res.status(200).json({message: 'connection requests fetched successfully', connectionRequests: connectionRequests});

    } catch (err) {
        res.status(400).json({"Error" : err.message});
    }
});


//getting all the accepted connections of the logged in user
router.get('/connections',authenticate,async (req,res)=>{

    try {

        let loggedInUser = req?.user?.id;

        const connectionRequests = await ConnectionRequest.find({
            $and: [
                { status: 'accepted' },
                {
                    $or: [
                        { fromUserId: loggedInUser },
                        { toUserId: loggedInUser }
                    ]
                }]
        }).populate("fromUserId", POPULATE_USER_DATA).populate("toUserId", POPULATE_USER_DATA);

        const connectionData = connectionRequests.map((data) => {
            const connectionId = data._id;

            if (data.fromUserId._id.equals(loggedInUser)) {
                return {...data.toUserId.toObject(),connectionId:connectionId};
            }
            return {...data.fromUserId.toObject(),connectionId:connectionId};
        }
        );
        
        res.status(200).json({ connectionRequest: connectionData });
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// deleting the connection request.
router.delete('/connections/:connectionId',async(req,res)=>{

    let connectionId = req?.params?.connectionId;

    try {
        
        const connections = await ConnectionRequest.deleteOne({_id:connectionId});

        if(connections?.deletedCount === 1){
            res.status(200).json({message:"Connection delected successfully"});
        }
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

// get all the users
router.get("/feed",authenticate, async (req, res) => {

    try {
        
        let loggedInUser = req?.user?.id;
        let page = req?.query ? parseInt(req.query.page) : 1;
        let limit = req?.query ? parseInt(req.query.limit) : 10;
        limit = limit > 50 ? 50 : limit;
        let skip = (page - 1) * limit;

        let connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser},{toUserId:loggedInUser}
            ]
        }).select("fromUserId toUserId");

        let hideUsers = new Set();

        // // finding the unique user id 
        connectionRequest.forEach((request) => {
            hideUsers.add(request?.fromUserId.toString());
            hideUsers.add(request?.toUserId.toString());
        });

        let users = await User.find({
            _id: { $nin: Array.from(hideUsers),$ne: loggedInUser }
        }).select("firstName lastName age gender photoUrl about skills").skip(skip).limit(limit);

        res.status(200).json({mesasge:"getAllFeed successful",feed:users});
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

module.exports={router};