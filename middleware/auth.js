const jwt=require("jsonwebtoken");
const User=require("../model/user");

const authenticate = async (req,res,next)=>{

    console.log({INFO:"authenticate function called"});
    
    let user,verfiedUser,token;

    try {

        token = req?.cookies?.authorizationToken;

        if (!token) {
            throw new Error("INVALID TOKEN");
        }

        if (token) {
            
            verfiedUser = await jwt.verify(token, CONFIG.JWT_SECRET_KEY);

            if (!verfiedUser) {
                throw new Error("AUNTHENTICATION FAILED");
            }

            if (verfiedUser) {

                user = await User.findById(verfiedUser?.id);

                if (!user) {
                    throw new Error("USER NOT FOUND");
                }
            }
        }

        req.user = verfiedUser;
        next();
    }
    catch (error) {
        res.status(400).send("Error: " + error.message);
    }
}

module.exports={
    authenticate
}