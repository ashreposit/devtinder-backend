const validator = require("validator");

const signUpValidator = function (req) {

    if (Array.isArray(req?.body?.skills) && req?.body?.skills?.length > 10) {
        throw new Error("only 10 skills allowed");
    }
    else if (!validator.isStrongPassword(req?.body?.password)) {
        throw new Error("Please enter a strong password");
    }
    else{
        return true;
    }
};

const updateValidator = function (req) {

    const ALLOWED_UPDATE_FIELD = ["firstName", "lastName","age","gender","photoUrl","about","skills"];
    let updateData = req?.body;

    for( let [key,value] of Object.entries(updateData)){

        if(!ALLOWED_UPDATE_FIELD.includes(key)){
            throw new Error("update not allowed");
        }

        if(key === 'skills' && Array.isArray(value) && value.length > 10) throw new Error("only 10 skills allowed");

    }

    return true;
};

const passwordValidator = function (req) {

    if (!validator.isStrongPassword(req?.body?.password)) {
        throw new Error("Please enter a strong password");
    }
    else {
        return true;
    }
};

module.exports = { signUpValidator, updateValidator, passwordValidator };