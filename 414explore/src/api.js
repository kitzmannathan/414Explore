const express = require('express');
const app = express();
const fs = require("fs");
const events = require("../Events.json");
const communities = require("../Communites.json");
const rsa = require("../RSAEncryption");

app.listen(3001)
let keys = rsa.generateKeys();
let message = rsa.encrypt("THISwouldBEaSuPeRlOnGandWACKYPASSword!@#$%^&*()",[keys[0],keys[2]]);
let decrypted = rsa.decrypt(message,[keys[1],keys[2]]);
app.get('/', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send("Successful connection to server.");
});

app.get('/get-Key', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send({
        "status": "success",
        "modulus": keys[2].toString(),
        "publicKey": keys[0].toString()
    });
});

app.get('/create-User', function(req, res, next) {
    //get all the headers
    let userName = req.query.userName;
    let password = req.query.password;
    let intrests = req.query.intrests;
    let school = req.query.school;
    let email = req.query.email;
    let age = req.query.age;
    let location = req.query.location;
    let userType = req.query.userType;
    let transportationPreference = req.query.transportationPreference;
    //if a required header is missing respond with an error
    if(userName === undefined || email === undefined || password === undefined || userType === undefined){
        res.status(400).send("Missing required data");
    }
    else {
        if (intrests.at(0) !== "[" && intrests.at(intrests.length - 1) !== "]") {
            res.status(400).send("intrests should be an array");
        } else {
            let temp = intrests.substring(1, intrests.length - 1)
            let intrestsArray = temp.split(",");
            intrestsArray = intrestsArray.map(item => item.trim())
            //grab the users file and parse the json
            let users = JSON.parse(fs.readFileSync("./Users.json", "utf-8"));
            //checks to see if there already is a user already with that email or username
            users.forEach(user => {
                if (user.userName === userName || user.email === email) {
                    res.status(400).send({
                        "status": "fail",
                        "msg": "User already exists"
                    });
                }
            });
            const newUser = {
                userType: userType,
                email: email,
                userName: userName,
                password: password,
                school: school,
                intrests: intrestsArray,
                age: age,
                location: location
            }
            //push the new user in to the users
            users.push(newUser);
            fs.writeFileSync("users.json", JSON.stringify(users), "utf-8");
            res.header('Access-Control-Allow-Origin', '*');
            res.status(200).send({
                "status": "success",
                "msg": users
            });
        }
    }
});

app.get('/get-Events', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send({
        "status": "success",
        "msg": [events]
    });
});

app.get('/get-Communities', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).send({
        "status": "success",
        "msg": [communities]
    });
});

app.get('/get-User', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    let userName = req.query.userName;
    let users = JSON.parse(fs.readFileSync("./Users.json", "utf-8"));
    console.log(JSON.stringify(req.headers));
    if(userName === undefined){
        res.status(400).send({
            "status": "fail",
            "msg": "Username not defined"
        });
    }
    else{
        let found = false;
        let foundUser = {};
        users.forEach(user=>{
            if(user.userName === userName){
                found = true;
                foundUser = user;
            }
        });
        if(found){
            res.status(200).send({
                "status": "success",
                "msg": foundUser
            });
        }
        else{
            res.status(400).send({
                "status": "fail",
                "msg": "User Not found"
            });
        }
    }
})

module.exports = app;