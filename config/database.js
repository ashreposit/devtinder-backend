const mongoose = require("mongoose");

const connection = async () => {
    await mongoose.connect("mongodb+srv://anithaasha12:asha%402002@cluster0.ub9xu.mongodb.net/devTinder");
};

module.exports={connection};