const express = require("express");
const app = express();
const { connection } = require("./config/database");
const User = require("./model/user");
const { signUpValidator } = require("./utils/validators");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const customEnv = require("custom-env");
const { authenticate } = require("./middleware/auth");


app.use(express.json());
app.use(cookieParser());

// new create request
app.post("/signup", async (req, res) => {

    if (req?.body) {

        try {

            signUpValidator(req);

            let saltRounds = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // generate random saltrounds between 8 - 12 to create unique password for every user. 

            let salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // create a new instance of User model
            const user = new User({
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                emailId: req?.body?.emailId,
                password: hashedPassword,
                age: req?.body?.age,
                gender: req?.body?.gender,
                photoUrl: req?.body?.photoUrl,
                about: req?.body?.about,
                skills: req?.body?.skills
            });

            // save the data 
            await user.save({ runValidators: true });
            res.send("user added successfully");
        }
        catch (err) {
            res.status(400).send("error in creating user" + err.message);
        }
    }
    else {
        throw new Error("DATA_NOT_RECIEVED");
    }
});

// Authentication of user by email,password and ending back jwt token
app.post("/signin", async (req, res) => {

    if (req?.body) {

        try {

            let user = await User.findOne({ emailId: req?.body?.emailId });

            if (!user) throw new Error("NO_USER_FOUND");

            if (user?.password) {

                let isValidPassword = await user.validatePassword(req?.body?.password);

                if (!isValidPassword) throw new Error("INVALID_LOGIN");

                if (isValidPassword) {

                    const token = await user.getJWT();

                    res.cookie("authorizationToken", token, { maxAge: CONFIG.COOKIE_EXPIRATION, httpOnly: true, sameSite: "Strict" });

                    res.send("Valid user");
                }
            }
            else {
                throw new Error("NO_USER_FOUND");
            }
        }
        catch (err) {
            res.status(400).send("Error: " + err.message);
        }
    }
    else {
        throw new Error("REQUEST_BODY_REQUIRED");
    }
});


app.get("/profile", authenticate, async (req, res) => {

    console.log({ req: req.user });

});

app.post("/logout", async (req, res) => {
    res.clearCookie("authorizationToken");
    res.send("logged out successfully...");
})



// get one user by id 
app.get('/userbyid', async (req, res) => {
    try {
        let user = await User.findById({ _id: req.body.id });
        if (!user) {
            res.send("user not found");
        }
        else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

// get one user by emailId
app.get("/user", async (req, res) => {

    try {
        let userData = await User.findOne({ emailId: req.body.emailId });
        if (!userData) {
            res.status(404).send("user not found");
        }
        res.send(userData);
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

// get all the users
app.get("/feed", async (req, res) => {

    try {
        let userData = await User.find();
        if (userData.length == 0) {
            res.status(404).send("no data found");
        }
        else {
            res.send(userData);
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

// update an user by using id
app.patch("/user/:userId", async (req, res) => {

    console.log({ INFO: "update user called" });

    let userId = req?.params?.userId;
    let updateData = req?.body;
    updateData.modifiedAt = new Date(Date.now()).toISOString();

    try {

        const RESTRICTED_UPDATE_FIELD = ["emailId"];

        const isUpdateRestricted = Object.keys(updateData).every(field => {
            RESTRICTED_UPDATE_FIELD.includes(field)
        });

        if (isUpdateRestricted) {
            throw new Error("update not allowed");
        }

        if (!userId) {
            throw new Error("User ID is required");
        }

        if (Array.isArray(updateData.skills) && updateData?.skills?.length > 10) {
            console.log({ INFO: "validation called to check array " });

            throw new Error("only 10 skills allowed");
        }

        let user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    }
    catch (err) {
        res.status(500).send("something went wrong" + err.message);
    }
});

// update an user by using other values
app.patch("/userupdate", async (req, res) => {
    let filterData = req?.body?.mail;
    let updateData = { emailId: req?.body?.emailId };
    try {
        let user = await User.findOneAndUpdate({ emailId: filterData }, updateData, { returnDocument: "after" });
        res.send(user);
    }
    catch (err) {
        res.status(400).send("something went wrong" + err.message);
    }
});

// delete user api
app.delete("/user", async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req?.body?.id);
        if (!user) {
            res.send("user already deleted");
        } else {
            res.send("user deleted successfully");
        }
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});

connection().then(() => {
    console.log("successfully connected to the database...");
    app.listen(CONFIG.APP_PORT || 3000, () => {
        console.log(`server running on port ${CONFIG.APP_PORT || 3000}....`);
    });
})
    .catch(err => {
        console.log("couldn't connect to the database", err);
    });

