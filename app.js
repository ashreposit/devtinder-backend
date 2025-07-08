const express = require("express");
const app = express();
const { connection } = require("./config/database");
const User = require("./model/user");
const cookieParser = require("cookie-parser");
const customEnv=require("custom-env");
const cors = require("cors");
require("./config/config");
const http = require('http');

const authRouter=require("./routes/auth");
const requestRouter=require("./routes/request");
const profileRouter=require("./routes/profile");
const userRequestRouter=require("./routes/userRequest");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const socketConfig = require("./utils/socket");

require('./utils/cronjob');

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth',authRouter.router);
app.use('/request',requestRouter.router);
app.use('/profile',profileRouter.router);
app.use('/user',userRequestRouter.router);
app.use('/payment',paymentRouter.router);
app.use('/chat',chatRouter.router);

const server = http.createServer(app);
socketConfig.initializeSocket(server);

connection().then(() => {
    console.log("successfully connected to the database...");
    server.listen(CONFIG.APP_PORT || 3000, () => {
        console.log(`server running on port ${CONFIG.APP_PORT || 3000}....`);
    });
})
.catch(err => {
        console.log("couldn't connect to the database", err);
});

