const validator = require("validator");

const signUpValidator = function (req){

    if (Array.isArray(req?.body?.skills) && req?.body?.skills?.length > 10) {
        throw new Error("only 10 skills allowed");
    }
    else if(!validator.isStrongPassword(req?.body?.password)){
        throw new Error("Please enter a strong password");
    }
}

module.exports={signUpValidator};