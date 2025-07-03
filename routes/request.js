const express = require('express');
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user');

const sendEmail = require('../utils/sendEmail');


//sending a connection request to a user
router.post('/send/:status/:userId', authenticate, async (req, res) => {

    let fromUserId = req?.user?.id;
    let toUserId = req?.params?.userId;
    let status = req?.params?.status;

    try {

        const validStatus = ["interested", "ignored"];

        let data;

        if (!validStatus.includes(status)) {
            return res.status(400).send("invalid status: " + status);
        }

        // check if the toUser is a valid user
        const validToUser = await User.findById(toUserId);

        if (!validToUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // checking if there is an existing connection request between two users
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId:validToUser },
                { fromUserId: validToUser, toUserId: fromUserId }
            ]
        });

        if (!existingConnectionRequest) {

            const connectionRequest = new ConnectionRequest({
                fromUserId, toUserId:validToUser, status
            });

            data = await connectionRequest.save();

            let emailResponse = await sendEmail.run({subject:'connection request send sucessfully',body:`Connection request sent to ${validToUser.firstName +' '+ validToUser.lastName}`});

            console.log(emailResponse);

            savedRequest = await ConnectionRequest.findById(data._id)
                .populate("toUserId", "firstName lastName age gender photoUrl about skills");

        }
        else {
            return res.status(400).json({ message: "connection request already exists" });
        }

        res.json({ msg: "resquest Data added successfully", data: savedRequest });
    }
    catch (err) {
        res.status(400).json({"Error" : err.message});
    }
});

// receiving a connection request from another user using the requestId of the connection.
// works only when the connection status between 2 users is interested.
router.post('/review/:status/:requestId', authenticate, async (req, res) => {

    let loggedInUser = req?.user?.id;
    let requestId = req?.params?.requestId;
    let status = req?.params?.status;

    try {

        const validStatus = ['accepted', 'rejected'];

        if (!validStatus.includes(status)) {
            return res.status(400).json({message:"invalid status"});
        }

        //checking if the interested connection is already done by any user using the requestId.
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser,
            status: 'interested'
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found" });
        }

        connectionRequest.status = status;
        connectionRequest.modifiedAt = new Date(Date.now()).toISOString();

        const connection = await connectionRequest.save();

        res.json({ message: "connection added successfully", connection: connection });

    } catch (err) {
        res.status(400).json({"Error" : err.message});
    }
});

module.exports = { router };
