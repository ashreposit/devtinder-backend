const express = require("express");
const app = express();
const { connection } = require("./config/database");
const User = require("./model/user");
const cookieParser = require("cookie-parser");
const customEnv=require("custom-env");
const cors = require("cors");
require("./config/config");

const authRouter=require("./routes/auth");
const requestRouter=require("./routes/request");
const profileRouter=require("./routes/profile");
const userRequestRouter=require("./routes/userRequest");
const paymentRouter = require("./routes/payment");

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

connection().then(() => {
    console.log("successfully connected to the database...");
    app.listen(CONFIG.APP_PORT || 3000, () => {
        console.log(`server running on port ${CONFIG.APP_PORT || 3000}....`);
    });
})
.catch(err => {
        console.log("couldn't connect to the database", err);
});

