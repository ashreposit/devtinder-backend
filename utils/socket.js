const socket = require('socket.io');
const crypto = require('crypto');
const chatModel = require('../model/chat');

const getSecretRoomId = (userId, toUserId) => {
    return crypto.createHash("sha256").update([userId, toUserId].sort().join('_')).digest("hex");
};

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on("connection", (socket) => {
        // handle events
        socket.on("joinChat", ({ firstName, lastName, userId, toUserId }) => {
            const roomId = getSecretRoomId(userId, toUserId);
            console.log(firstName + " joined room: ", roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, lastName, userId, toUserId, text }) => {
            // save message to the database
            try {
                const roomId = getSecretRoomId(userId, toUserId);
                console.log({ INFO: `${firstName} ${text}` });

                const existingConnectionRequest = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: toUserId, status: "accepted" },
                        { fromUserId: toUserId, toUserId: userId, status: "accepted" }
                    ]
                });

                if (!existingConnectionRequest) {

                    let chat = await chatModel.findOne({
                        participants: {
                            $all: [userId, toUserId]
                        }
                    });

                    if (!chat) {
                        chat = new chatModel({
                            participants: [userId, toUserId],
                            messages: []
                        });
                    }

                    chat.messages.push({ senderId: userId, text });

                    await chat.save();

                    io.to(roomId).emit("messageRecieved", { firstName, lastName, text });
                }
            }
            catch (error) {
                console.log(error.mesage);
            }
        });

        socket.on("endChat", () => {

        });
    });
}

module.exports.initializeSocket = initializeSocket;