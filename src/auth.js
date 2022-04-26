var express = require('express');
var router = express.Router();
var dbConnection = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10; // by default 10 is used
require('dotenv').config(); // import the env file
const key = process.env.key; //get private key from the env file

router.post('/login', async function(req, res, err){
    client = await dbConnection.getDb(); //get connection instance
    db = client.db('Project_Health'); //point to spicific db
    if(!req.body.id || !req.body.password){ // input validation
        return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
    }

    result = await db.collection("user").findOne({'id': req.body.id}, function(err, result) { //find the data from the database
        if (err) throw err;
        if (!result) {
            return res.status(401).send('This id is not associated with any account.');
        } else {
                bcrypt.compare(req.body.password, result.password, function(err, result) { //check if the password inputted by user is the same as the password stored in db
                    if (result === true) { // if it is true, return true
                        jwt.sign( {id: req.body.id} , key, { algorithm: 'HS256', expiresIn: '7d' }, async function(err, token) { //sign the user id using jwt token
                            if (err) throw err;
                            res.status(200).send({'token': token});
                          });
                    } else if (result === false) { //if the password is wrong, send error message
                        res.status(403).send("Wrong password");
                    } else {
                        res.status(500).send("Server error, please try again later");
                    }
                });
            }
      });
});

router.post('/register', async function(req, res){
    try {
        client = await dbConnection.getDb(); //get connection instance
        if(!req.body.id || !req.body.password){ // input validation
            return res.status(422).send('Missing parameters. The required parameters are id and password.'); //send error message for missing parameters
        }
        db = client.db('Project_Health'); //point to spicific db
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, async function(err, hash) {
                var data = { // define the databody
                    "id": req.body.id,
                    "password": hash,
                }
                await db.collection('user').insertOne(data); //insert the data into the database
                return res.status(500).send('Register Successful');
            });
        });
    } catch (error) {
        console.log({"ERROR": error})
    }
});

//export this router to use in our index.js
module.exports = router;