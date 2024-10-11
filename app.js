const express = require("express");
const app = express();
const {connection} = require("./config/database");
const User = require("./model/user");

// new create request
app.post("/signup",async(req,res)=>{
    
    // create a new instance of User model
    const user=new User({
        firstName:"Asha",
        lastName:"Laxmi",
        emailId:"asha@gmail.com",
        password:12345
    });

    try{
        // save the data 
        await user.save();
        res.send("user added successfully");
    }
    catch(err){
        res.status(400).send("error in creating user"+err.message);
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

