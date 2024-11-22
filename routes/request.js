const express = require('express');
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user');


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
        }
        else {
            return res.status(400).json({ message: "connection request already exists" });
        }

        res.json({ msg: "resquest Data added successfully", data: data });
    }
    catch (err) {
        res.status(400).send("Error: "+err.message);
    }
});

module.exports = { router };