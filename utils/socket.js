const socket = require('socket.io');
const crypto = require('crypto');

const getSecretRoomId =(userId,toUserId)=>{
    return crypto.createHash("sha256").update([userId,toUserId].sort().join('_')).digest("hex");
};

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on("connection", (socket) => {
        // handle events
        socket.on("joinChat",({firstName,userId,toUserId})=>{
            const roomId = getSecretRoomId(userId,toUserId);
            console.log(firstName + " joined room: ",roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage",({firstName,userId,toUserId,text})=>{
            const roomId = getSecretRoomId(userId,toUserId);
            io.to(roomId).emit("messageRecieved",{firstName,text});
        });

        socket.on("endChat",()=>{

        });
    });
}

module.exports.initializeSocket = initializeSocket;