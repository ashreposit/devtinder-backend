const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const chatModel = require("../model/chat");

router.get("/:toUserId", authenticate, async (req, res) => {
    try {
        const fromUserId = req?.user?.id;
        const toUserId = req?.params?.toUserId;

        let page = req?.query ? parseInt(req.query.page) : 1;
        let limit = req?.query ? parseInt(req.query.limit) : 10;
        limit = limit > 50 ? 50 : limit;
        let skip = (page - 1) * limit;

        let chat = await chatModel.findOne({
            participants: { $all: [fromUserId, toUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        }).skip(skip).limit(limit);

        if (!chat) {
            chat = new chatModel({
                participants: [fromUserId, toUserId],
                messages: []
            });

            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching chat: ", error.message);
        res.status(500).json({ error: "Failed to fetch chat messages." });
    }
});

module.exports.router = router;
