const express = require("express");
const app = express();
const { connection } = require("./config/database");
const User = require("./model/user");
const {signUpValidator} = require("./utils/validators");

app.use(express.json());

// new create request
app.post("/signup", async (req, res) => {

    if (req?.body) {

        try {

            signUpValidator(req);

            // create a new instance of User model
            const user = new User(req?.body);

            // save the data 
            await user.save({ runValidators: true });
            res.send("user added successfully");
        }
        catch (err) {
            res.status(400).send("error in creating user" + err.message);
        }
    }
    else {
        throw new Error("DATA_NOT_RECIEVED");
    }
});

// get one user by id 
app.get('/userbyid', async (req, res) => {
    try {
        let user = await User.findById({ _id: req.body.id });
        if (!user) {
            res.send("user not found");
        }
        else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

// get one user by emailId
app.get("/user", async (req, res) => {

    try {
        let userData = await User.findOne({ emailId: req.body.emailId });
        if (!userData) {
            res.status(404).send("user not found");
        }
        res.send(userData);
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

// get all the users
app.get("/feed", async (req, res) => {

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

// update an user by using id
app.patch("/user/:userId", async (req, res) => {

    console.log({INFO:"update user called"});
    
    let userId = req?.params?.userId;
    let updateData = req?.body;
    updateData.modifiedAt = new Date(Date.now()).toISOString();

    try {

        const RESTRICTED_UPDATE_FIELD = ["emailId"];

        const isUpdateRestricted = Object.keys(updateData).every(field => {
            RESTRICTED_UPDATE_FIELD.includes(field)
        });

        if (isUpdateRestricted) {
            throw new Error("update not allowed");
        }

        if (!userId) {
            throw new Error("User ID is required");
        }

        if(Array.isArray(updateData.skills) && updateData?.skills?.length > 10){
            console.log({INFO:"validation called to check array "});
            
            throw new Error("only 10 skills allowed");
        }

        let user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    }
    catch (err) {
        res.status(500).send("something went wrong" + err.message);
    }
});

// update an user by using other values
app.patch("/userupdate",async(req,res)=>{
    let filterData=req?.body?.mail;
    let updateData={emailId:req?.body?.emailId};
    try{
        let user = await User.findOneAndUpdate({emailId:filterData},updateData,{returnDocument:"after"});
        res.send(user);
    }
    catch(err){
        res.status(400).send("something went wrong"+err.message);
    }
});

// delete user api
app.delete("/user", async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req?.body?.id);
        if (!user) {
            res.send("user already deleted");
        } else {
            res.send("user deleted successfully");
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

connection().then(() => {
    console.log("successfully connected to the database...");
    app.listen(7777, () => {
        console.log("server running on port 7777....");
    });
})
    .catch(err => {
        console.log("couldn't connect to the database", err);
    });

