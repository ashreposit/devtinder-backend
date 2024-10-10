const express = require("express");
const app = express();
const {connection} = require("./config/database");

connection().then(() => {
    console.log("successfully connected to the database...");
    app.listen(7777, () => {
        console.log("server running on port 7777....");
    });
})
.catch(err => {
    console.log("couldn't connect to the database", err);
});

