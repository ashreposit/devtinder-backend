const mongoose = require("mongoose");
require("../config/config");

const connection = async () => {    
    await mongoose.connect(CONFIG.DATABASE_URL);
};

module.exports={connection};