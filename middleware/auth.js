const adminAuth=(req,res,next)=>{

    console.log({userName:req.query.userName});
    

    if(req?.query?.userName==="Asha"){
        res.send("Welcome Admin!");
    }
    else{
        res.status(401).send("You are not admin");
    }
    next();
};

const userAuth=(req,res,next)=>{

    if(req?.query?.name!=="admin"){
        res.send("Hello user!");
    }
    else{
        res.status(401).send("not a user");
    }
    next();
};

module.exports={adminAuth,userAuth};