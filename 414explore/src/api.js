const express = require('express');
const app = express();
const fs = require("fs");
const events = require("./Events.json");
const communities = require("./Communites.json");
const rsa = require("./RSAEncryption");
const cors = require('cors')
const {decrypt} = require("./RSAEncryption");

app.listen(3001);
app.use(cors());
//get the keys
let keys = rsa.generateKeys();

//save the keys into a file for front end use
let keysFile ={
    "publicKey": keys[0].toString(),
    "modulus": keys[2].toString()
}

//save the file
fs.writeFileSync("./src/keys.json", JSON.stringify(keysFile), "utf-8");

//sanity check connection
app.get('/', function(req, res, next) {
    res.status(200).send("Successful connection to server.");
});

//used to create a user is password protected
app.get('/create-User', function(req, res, next) {
    //if authorization was passed as a header and it is the correct password then try to create a user
    if(req.headers.authorization !== undefined && req.headers.authorization !== "" && rsa.decrypt(req.headers.authorization, [keys[1],keys[2]]) === "414ExploreAdmin!") {
        //get all the headers
        let userName = req.query.userName;
        let password = req.query.password;
        let intrests = req.query.intrests;
        let school = req.query.school;
        let email = req.query.email;
        let age = req.query.age;
        let location = req.query.location;
        let userType = req.query.userType;
        let name = req.query.name;
        let transportationPreference = req.query.transportationPreference;
        //if a required header is missing respond with an error
        if (userName === undefined || email === undefined || password === undefined || userType === undefined || name === undefined) {
            res.status(400).send({
                "status": "fail",
                "msg": "Missing required data"
            });
        } else {
            if (intrests !== undefined && intrests.at(0) !== "[" && intrests.at(intrests.length - 1) !== "]") {
                res.status(400).send({
                    "status": "fail",
                    "msg": "Interests should be an array"
                });
            } else {
                let temp = []
                let intrestsArray = []
                if (intrests !== undefined) {
                    temp = intrests.substring(1, intrests.length - 1)
                    intrestsArray = temp.split(",");
                    intrestsArray = intrestsArray.map(item => item.trim())
                }
                //grab the users file and parse the json
                let users = JSON.parse(fs.readFileSync("./src/Users.json", "utf-8"));
                let valid = true;
                //checks to see if there already is a user already with that email or username
                users.forEach(user => {
                    if (user.userName === userName || user.email === email) {
                        valid = false;
                    }
                });
                if (valid) {
                    const newUser = {
                        userType: userType,
                        email: email,
                        name: name,
                        userName: userName,
                        password: decrypt(password, [keys[1], keys[2]]),
                        school: school,
                        intrests: intrestsArray,
                        age: age,
                        location: location,
                        transportationPreference: transportationPreference
                    }
                    //push the new user in to the users
                    users.push(newUser);
                    fs.writeFileSync("./src/Users.json", JSON.stringify(users), "utf-8");
                    res.status(200).send({
                        "status": "success",
                        "msg": "User created"
                    });
                }
                else{
                    res.status(400).send({
                        "status": "fail",
                        "msg": "User already exists"
                    });
                }
            }
        }
    }
    else{
        res.status(400).send({
            "status": "fail",
            "msg": "Not authorized"
        });
    }
});

app.get('/get-Events', function(req, res, next) {
    //if authorization was passed as a header and it is the correct password then return the events
    if(req.headers.authorization !== undefined && req.headers.authorization !== "" && rsa.decrypt(req.headers.authorization, [keys[1],keys[2]]) === "414ExploreAdmin!") {
        res.status(200).send({
            "status": "success",
            "msg": [events]
        });
    }
    else{
        res.status(400).send({
            "status": "fail",
            "msg": "Not authorized"
        });
    }
});

app.get('/get-Communities', function(req, res, next) {
    //if authorization was passed as a header and it is the correct password then return the communities
    if(req.headers.authorization !== undefined && req.headers.authorization !== "" && rsa.decrypt(req.headers.authorization, [keys[1],keys[2]]) === "414ExploreAdmin!") {
        res.status(200).send({
            "status": "success",
            "msg": [communities]
        });
    }
    else{
        res.status(400).send({
            "status": "fail",
            "msg": "Not authorized"
        });
    }
});

app.get('/get-User', function(req, res, next) {
    //if authorization was passed as a header and it is the correct password then try to return the user info
    if(req.headers.authorization !== undefined && req.headers.authorization !== "" && rsa.decrypt(req.headers.authorization, [keys[1],keys[2]]) === "414ExploreAdmin!") {
        let email = req.query.email;
        let users = JSON.parse(fs.readFileSync("./src/Users.json", "utf-8"));
        if (email === undefined) {
            res.status(400).send({
                "status": "fail",
                "msg": "Email not defined"
            });
        } else {
            let found = false;
            let foundUser = {};
            users.forEach(user => {
                if (user.email === email) {
                    found = true;
                    foundUser = user;
                }
            });
            foundUser.password = "";
            if (found) {
                res.status(200).send({
                    "status": "success",
                    "msg": foundUser
                });
            } else {
                res.status(400).send({
                    "status": "fail",
                    "msg": "User Not found"
                });
            }
        }
    }
    else{
        res.status(400).send({
            "status": "fail",
            "msg": "Not authorized"
        });
    }
})

app.get('/login', function(req, res, next) {
    //if authorization was passed as a header and it is the correct password then try to return the user info
    if(req.headers.authorization !== undefined && req.headers.authorization !== "" && rsa.decrypt(req.headers.authorization, [keys[1],keys[2]]) === "414ExploreAdmin!") {
        let email = req.query.email;
        let password = req.query.password;
        let users = JSON.parse(fs.readFileSync("./src/Users.json", "utf-8"));
        if (email === undefined || password === undefined) {
            res.status(400).send({
                "status": "fail",
                "msg": "Username or password not defined"
            });
        } else {
            let currentLogins = fs.readFileSync("./src/logins.txt", "utf-8");
            let found = false;
            let success = "";
            let foundUser = {};
            users.forEach(user => {
                if (user.email === email) {
                    found = true;
                    foundUser = user;
                }
            });
            if (found) {
                if(rsa.decrypt(password, [keys[1], keys[2]]) === foundUser.password){
                    success = "succeeded"
                    res.status(200).send({
                        "status": "success",
                        "msg": "Valid username and password"
                    });
                }
                else{
                    success = "failed";
                    res.status(400).send({
                        "status": "fail",
                        "msg": "Username and password do not match"
                    });
                }
                currentLogins += "Login attempt " + success +" email " + email + " On " + new Date(Date.now()).toUTCString() + "\n";
                fs.writeFileSync("./src/logins.txt", currentLogins, "utf-8");
            }
            else {
                res.status(400).send({
                    "status": "fail",
                    "msg": "User Not found"
                });
            }
        }
    }
    else{
        res.status(400).send({
            "status": "fail",
            "msg": "Not authorized"
        });
    }
})

app.get('/verify-Email', function(req, res, next) {
    //if authorization was passed as a header and it is the correct password then return the communities
    if(req.headers.authorization !== undefined && req.headers.authorization !== "" && rsa.decrypt(req.headers.authorization, [keys[1],keys[2]]) === "414ExploreAdmin!") {
        let email = req.query.email;
        let users = JSON.parse(fs.readFileSync("./src/Users.json", "utf-8"));
        if (email === undefined) {
            res.status(400).send({
                "status": "fail",
                "msg": "Email not defined"
            });
        } else {
            let found = false;
            users.forEach(user => {
                if (user.email === email) {
                    found = true;
                }
            });
            if(found){
                res.status(400).send({
                    "status": "fail",
                    "msg": "Email is currently in use"
                });
            }
            else {
                res.status(200).send({
                    "status": "success",
                    "msg": "Email is not currently in use"
                });
            }
        }
    }
    else{
        res.status(400).send({
            "status": "fail",
            "msg": "Not authorized"
        });
    }
});

module.exports = app;