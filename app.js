const express=require("express");
const app=express();
const {adminAuth,userAuth}=require("./middleware/auth");

app.use('/admin',adminAuth,(err,req,res,next)=>{
    console.log("middleware request handler called");
    if(err) res.status(400).send("error occurred");
});

app.get("/admin/get",(req,res)=>{
    res.send("hello");
});

app.listen(7777,()=>{
    console.log("server running on port 7777....");
});