const express = require("express");
const app = express();
const { connection } = require("./config/database");
const User = require("./model/user");

app.use(express.json());

// new create request
app.post("/signup", async (req, res) => {

    // create a new instance of User model
    const user = new User(req?.body);

    try {
        // save the data 
        await user.save();
        res.send("user added successfully");
    }
    catch (err) {
        res.status(400).send("error in creating user" + err.message);
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
app.patch("/user", async (req, res) => {
    let userId = req?.body?.id;
    let updateData = req?.body;
    console.log({userId,updateData});
    
    try {
        let user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: "after" });
        res.send(user);
    }
    catch (err) {
        res.status(400).send("something went wrong");
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

