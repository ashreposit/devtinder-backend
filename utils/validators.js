const validator = require("validator");

const signUpValidator = function (req){

    if (Array.isArray(req?.body?.skills) && req?.body?.skills?.length > 10) {
        throw new Error("only 10 skills allowed");
    }
    else if(!validator.isStrongPassword(req?.body?.password)){
        throw new Error("Please enter a strong password");
    }
}

const updateValidator = function (req) {

    const RESTRICTED_UPDATE_FIELD = ["emailId"];
    let updateData = req?.body;

    const isUpdateRestricted = Object.keys(updateData).every(field => {
        RESTRICTED_UPDATE_FIELD.includes(field)
    });

    if (isUpdateRestricted) {
        throw new Error("update not allowed");
    }

    if (Array.isArray(updateData.skills) && updateData?.skills?.length > 10) {
        console.log({ INFO: "validation called to check array " });

        throw new Error("only 10 skills allowed");
    }
}

module.exports={signUpValidator,updateValidator};